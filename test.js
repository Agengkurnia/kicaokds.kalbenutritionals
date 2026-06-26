            }
            $('#lovDetailPphTypeModal').modal('hide');
        }

        function clearPphType(index) {
            const row = detailRows[index];
            row.pphType = 'NON PPH';
            row.pphTarif = 0;
            
            renderTable();
            syncToStorage();
        }

        // PDF Attachment helpers
        function uploadAttachment(index, input) {
            if (input.files && input.files[0]) {
                const file = input.files[0];
                if (file.type !== "application/pdf") {
                    bootbox.alert("File attachment harus berupa PDF!");
                    input.value = '';
                    return;
                }
                detailRows[index].attachmentName = file.name;
                renderTable();
                syncToStorage();
            }
        }

        function viewAttachment(index) {
            const name = detailRows[index].attachmentName;
            bootbox.alert(`Viewing PDF Attachment: <strong>${name}</strong> (Prototype Mock Viewer)`);
        }

        function removeAttachment(index) {
            detailRows[index].attachmentName = '';
            renderTable();
            syncToStorage();
        }

        function updateIncludeCell(index, checked) {
            detailRows[index].include = checked;
            renderTable();
            syncToStorage();
        }

        function deleteRow(index) {
            bootbox.confirm("Delete this Claim detail row?", (res) => {
                if (res) {
                    detailRows.splice(index, 1);
                    renderTable();
                    syncToStorage();
                }
            });
        }

        function openUmbrand(index) {
            syncToStorage();
            openKlaimPopup(`${basePath}Views/Klaim/Umbrand.html?intIndex=${index}`, 'Klaim Umbrand');
        }

        function openScanFaktur(index) {
            syncToStorage();
            openKlaimPopup(`${basePath}Views/Klaim/ScanFakturPajak.html?intIndex=${index}`, 'Scan Faktur Pajak');
        }

        function handleAddDetail() {
            if ($("#txtGroupAccount").val() == "") {
                bootbox.alert("Supplier belum dipilih!");
                return;
            }
            detailRows.push({
                activity: 'ACT-KCO-01',
                programDesc: '',
                periodFrom: moment().format('DD-MMM-YYYY'),
                periodTo: moment().add(30, 'days').format('DD-MMM-YYYY'),
                invoiceNo: '',
                invoiceDate: moment().format('DD-MMM-YYYY'),
                fakturNo: '',
                fakturDate: moment().format('DD-MMM-YYYY'),
                invoiceAmount: 0,
                pphType: 'NON PPH',
                pphTarif: 0,
                ppnType: 'NON PPN',
                ppnTarif: 0,
                ppnAmount: 0,
                allBrand: true,
                umbrand: '',
                umbrandData: [],
                status: 'OPEN',
                description: '',
                include: true,
                attachmentName: ''
            });
            syncToStorage();
            renderTable();
        }

        // LOV Triggers
        function openGroupAccountLov() {
            $('#lovGroupAccountModal').modal('show');
        }

        function selectGroupAccount(name, code, supplierName, site) {
            const prevName = document.getElementById('txtGroupAccount').value;
            if (prevName !== name) {
                // Reset dependent fields if group account changed
                document.getElementById('txtPartner').value = '';
                document.getElementById('txtOutlet').value = '';
                document.getElementById('txtBranchName').value = '';
            }

            document.getElementById('txtGroupAccount').value = name;
            document.getElementById('txtSupplierCode').value = code;
            document.getElementById('txtSupplierName').value = supplierName;
            
            const parts = code.split('-');
            const supCode = parts.length > 2 ? parts[2] : code;
            document.getElementById('txtSupplierID').value = 'SUP-' + supCode;
            
            document.getElementById('txtSupplierSiteID').value = site;
            document.getElementById('txtSupplierSiteName').value = site + ' OFFICE';

            // Regulation: Partner search button is only shown if Group Account === "ENSEVAL"
            if (name.trim().toUpperCase() === "ENSEVAL") {
                $('#btnLOVPartner').parent().show();
            } else {
                $('#btnLOVPartner').parent().hide();
            }

            $('#lovGroupAccountModal').modal('hide');
            syncToStorage();
        }

        function openPartnerLov() {
            const grpAcc = document.getElementById('txtGroupAccount').value;
            if (!grpAcc) {
                bootbox.alert("Please select a Group Account first!");
                return;
            }

            const tbody = document.getElementById('lovPartnerTableBody');
            tbody.innerHTML = '';
            
            // Reset search box value
            $('#lovPartnerModal input[type="text"]').val('');

            // Filter partners by selected Group Account
            const filtered = partnersData.filter(p => p.group_account.trim().toUpperCase() === grpAcc.trim().toUpperCase());

            if (filtered.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No partners available for this Group Account</td></tr>';
                $('#lovPartnerModal .lov-info').text('Showing 0 to 0 of 0 entries');
            } else {
                filtered.forEach((p) => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td style="text-align: center;">
                            <button type="button" class="btn btn-success btn-xs" onclick="selectPartner('${p.site.replace(/'/g, "\\'")}', '${p.branch.replace(/'/g, "\\'")}', '${p.supplier_name.replace(/'/g, "\\'")}', '${p.code.replace(/'/g, "\\'")}', '${p.supplier_id.replace(/'/g, "\\'")}', '${p.site_id.replace(/'/g, "\\'")}', '${p.supplier_site_name ? p.supplier_site_name.replace(/'/g, "\\'") : ''}')"><i class="fa fa-check"></i> Pilih</button>
                        </td>
                        <td style="word-break: break-all; white-space: normal;">${p.site}</td>
                        <td>${p.branch}</td>
                        <td style="word-break: break-all; white-space: normal;">${p.supplier_name}</td>
                        <td>${p.group_account}</td>
                    `;
                    tbody.appendChild(tr);
                });
                $('#lovPartnerModal .lov-info').text(`Showing 1 to ${filtered.length} of ${filtered.length} entries`);
            }
            $('#lovPartnerModal').modal('show');
        }

        function selectPartner(site, branch, supplierName, code, supplierId, siteId, siteName) {
            document.getElementById('txtPartner').value = site;
            document.getElementById('txtBranchName').value = branch;
            document.getElementById('txtSupplierName').value = supplierName;
            document.getElementById('txtSupplierCode').value = code;
            document.getElementById('txtSupplierID').value = supplierId;
            document.getElementById('txtSupplierSiteID').value = siteId;
            document.getElementById('txtSupplierSiteName').value = siteName || (siteId + ' OFFICE');
            
            $('#lovPartnerModal').modal('hide');
            syncToStorage();
        }

        function openOutletLov() {
            const grpAcc = document.getElementById('txtGroupAccount').value;
            if (!grpAcc) {
                bootbox.alert("Please select a Group Account first!");
                return;
            }

            const tbody = document.getElementById('lovOutletTableBody');
            tbody.innerHTML = '';
            
            // Reset search box value
            $('#lovOutletModal input[type="text"]').val('');

            // Filter outlets by selected Group Account
            const filtered = outletsData.filter(o => o.group_account.trim().toUpperCase() === grpAcc.trim().toUpperCase());

            if (filtered.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No outlets available for this Group Account</td></tr>';
                $('#lovOutletModal .lov-info').text('Showing 0 to 0 of 0 entries');
            } else {
                filtered.forEach(o => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td style="text-align: center;">
                            <button type="button" class="btn btn-success btn-xs" onclick="selectOutlet('${o.site.replace(/'/g, "\\'")}', '${o.supplier_id.replace(/'/g, "\\'")}', '${o.supplier_name.replace(/'/g, "\\'")}', '${o.branch.replace(/'/g, "\\'")}', '${o.supplier_site_id.replace(/'/g, "\\'")}', '${o.supplier_site_name.replace(/'/g, "\\'")}')"><i class="fa fa-check"></i> Pilih</button>
                        </td>
                        <td style="word-break: break-all; white-space: normal;">${o.site}</td>
                        <td>${o.supplier_id}</td>
                        <td style="word-break: break-all; white-space: normal;">${o.supplier_name}</td>
                        <td>${o.branch}</td>
                    `;
                    tbody.appendChild(tr);
                });
                $('#lovOutletModal .lov-info').text(`Showing 1 to ${filtered.length} of ${filtered.length} entries`);
            }
            $('#lovOutletModal').modal('show');
        }

        function selectOutlet(site, supplierId, supplierName, branch, supplierSiteId, supplierSiteName) {
            document.getElementById('txtOutlet').value = site;
            document.getElementById('txtSupplierCode').value = supplierId;
            document.getElementById('txtSupplierID').value = supplierId;
            document.getElementById('txtSupplierName').value = supplierName;
            document.getElementById('txtBranchName').value = branch;
            document.getElementById('txtSupplierSiteID').value = supplierSiteId;
            document.getElementById('txtSupplierSiteName').value = supplierSiteName;
            
            $('#lovOutletModal').modal('hide');
            syncToStorage();
        }

        // Workflow buttons
        function handleFind() {
            const tbody = document.getElementById('lovFindTableBody');
            tbody.innerHTML = '';
            
            // Reset search
            $('#lovFindModal input[type="text"]').val('');

            findData.forEach(item => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td style="text-align: center;">
                        <button type="button" class="btn btn-success btn-xs" onclick="selectFind('${item.id}', '${item.dokNo}', '${item.status}', '${item.site.replace(/'/g, "\\'")}')"><i class="fa fa-check"></i> Pilih</button>
                    </td>
                    <td>${item.id}</td>
                    <td>${item.dokNo}</td>
                    <td>${item.site}</td>
                    <td>${item.description}</td>
                    <td>${item.period}</td>
                    <td>${item.invoiceNo}</td>
                    <td style="text-align: right;">${item.invoiceAmount}</td>
                    <td>${item.status}</td>
                    <td>${item.attachment}</td>
                    <td>${item.readyToSubmit}</td>
                `;
                tbody.appendChild(tr);
            });
            
            document.getElementById('lovFindInfo').textContent = `Showing 1 to ${findData.length} of ${findData.length} entries`;
            $('#lovFindModal').modal('show');
        }

        function selectFind(id, dokNo, status, site) {
            document.getElementById('txtID').value = id;
            document.getElementById('txtDocNo').value = dokNo;
            document.getElementById('lblStatusFlow').textContent = status;
            
            let groupAccount = "ENSEVAL";
            if (site && site.toUpperCase().indexOf("ENSEVAL") === -1) {
                groupAccount = "KMMD";
            }
            document.getElementById('txtGroupAccount').value = groupAccount;
            document.getElementById('txtOutlet').value = site;
            
            // Hide the search buttons properly by hiding their wrapper
            $('#btnLOVGroupAccount').parent().hide();
            $('#btnLOVOutlet').parent().hide();
            $('#btnLOVPartner').parent().hide();
            
            // Populate mock detail record based on find selection
            detailRows = [
                {
                    activity: 'BONUS SUBDIST',
                    programDesc: 'MILNA BOGO PROMO 2026',
                    periodFrom: '01-Jan-2026',
                    periodTo: '31-Mar-2026',
                    invoiceNo: 'INV-KDS-' + id,
                    invoiceDate: '10-Jan-2026',
                    fakturNo: 'FP-001.002.' + id,
                    fakturDate: '10-Jan-2026',
                    invoiceAmount: 25000000,
                    pphType: 'PPh23_15%',
                    pphTarif: 15,
                    ppnType: 'PPN 11%',
                    ppnTarif: 11,
                    ppnAmount: 2750000,
                    allBrand: true,
                    umbrand: 'CH-MILNA',
                    umbrandData: [{ TXT_UMBRAND: 'MILNA', TXT_BRAND: 'MILNA UHT', DEC_AMOUNT: 25000000, XXSHP_KDS_T_KLAIM_BRAN: [] }],
                    status: status,
                    description: 'Mock detail loaded for claim ' + id,
                    include: true,
                    attachmentName: ''
                }
            ];
            
            // Set header buttons to exactly what the user requested
            document.getElementById('btnSubmit').style.display = 'inline-block';
            document.getElementById('btnCopy').style.display = 'none';
            document.getElementById('btnClose').style.display = 'none';
            document.getElementById('btnReject').style.display = 'none';
            document.getElementById('btnApprovalHistory').style.display = 'none';
            document.getElementById('divClose').style.display = 'none';
            
            renderTable();
            syncToStorage();
            $('#lovFindModal').modal('hide');
        }

        function handleSave() {
            bootbox.confirm("Save this data?", (res) => {
                if (res) {
                    if (!document.getElementById('txtID').value) {
                        document.getElementById('txtID').value = Math.floor(Math.random() * 90000 + 10000);
                        document.getElementById('txtDocNo').value = 'CLM-2026-' + Math.floor(Math.random() * 9000 + 1000);
                    }
                    document.getElementById('lblStatusFlow').textContent = 'DRAFT';
                    document.getElementById('lblStatusFlow').className = 'control-label text-yellow';
                    document.getElementById('btnSubmit').style.display = 'inline-block';
                    bootbox.alert("Claim saved as DRAFT successfully!");
                }
            });
        }

        function handleNew() {
            document.getElementById('txtID').value = '';
            document.getElementById('txtDocNo').value = '';
            document.getElementById('txtDocNoMkpp').value = '';
            document.getElementById('txtGroupAccount').value = '';
            document.getElementById('txtPartner').value = '';
            document.getElementById('txtOutlet').value = '';
            document.getElementById('txtSupplierSiteID').value = '';
            document.getElementById('txtSupplierSiteName').value = '';
            document.getElementById('txtSupplierCode').value = '';
            document.getElementById('txtBranchName').value = '';
            document.getElementById('txtSupplierID').value = '';
            document.getElementById('txtSupplierName').value = '';
            document.getElementById('txtRemark').value = '';
            document.getElementById('txtReasonReadySubmit').value = '';
            document.getElementById('rdoReadySubmitNo').checked = true;
            document.getElementById('divClose').style.display = 'none';

            document.getElementById('lblStatusFlow').textContent = 'NEW';
            document.getElementById('lblStatusFlow').className = 'control-label text-blue';
            
            document.getElementById('btnSubmit').style.display = 'none';
            document.getElementById('btnCopy').style.display = 'none';
            document.getElementById('btnClose').style.display = 'none';
            document.getElementById('btnReject').style.display = 'none';
            document.getElementById('btnApprovalHistory').style.display = 'none';

            $('#btnLOVPartner').parent().hide();
            $('#btnLOVGroupAccount').parent().show();
            $('#btnLOVOutlet').parent().show();

            detailRows = [];
            renderTable();
            syncToStorage();
        }

        function handleSubmit() {
            bootbox.confirm("Submit this data?", (res) => {
                if (res) {
                    document.getElementById('lblStatusFlow').textContent = 'SUBMITTED';
                    document.getElementById('lblStatusFlow').className = 'control-label text-orange';
                    document.getElementById('btnSubmit').style.display = 'none';
                    bootbox.alert("Claim successfully submitted for approval!");
                }
            });
        }

        function handlePrint() {
            bootbox.confirm("Print this document?", (res) => {
                if (res) {
                    bootbox.alert("Generating Claim Print report...");
                }
            });
        }

        function handleApprovalHistory() {
            bootbox.alert("<h4>Approval History</h4><p>1. <strong>Admin KICAO</strong> (Draft) - approved</p><p>2. <strong>Dept Head</strong> (Review) - approved</p>");
        }

        function handleClose() {
            bootbox.dialog({
                title: "Reason Close",
                message: '<input type="text" id="reasonInput" class="bootbox-input bootbox-input-textarea form-control" rows="4" placeholder="Enter your reason here...">',
                buttons: {
                    confirm: {
                        label: 'Submit',
                        className: 'btn-success',
                        callback: function () {
                            var reason = document.getElementById('reasonInput').value.trim();
                            if (reason.length >= 5) {
                                document.getElementById('divClose').style.display = 'block';
                                document.getElementById('lblStatusFlow').textContent = 'CLOSED';
                                document.getElementById('lblStatusFlow').className = 'control-label text-muted';
                            } else {
                                alert("Please enter a reason of at least 5 characters !");
                                return false;   
                            }
                        }
                    },
                    cancel: {
                        label: 'Cancel',
                        className: 'btn-danger'
                    }
                }
            });
        }

        function handleReject() {
            bootbox.dialog({
                title: "Reason Reject",
                message: '<input type="text" id="reasonInput" class="bootbox-input bootbox-input-textarea form-control" rows="4" placeholder="Enter your reason here...">',
                buttons: {
                    confirm: {
                        label: 'Submit',
                        className: 'btn-success',
                        callback: function () {
                            var reason = document.getElementById('reasonInput').value.trim();
                            if (reason.length >= 5) {
                                document.getElementById('lblStatusFlow').textContent = 'REJECTED';
                                document.getElementById('lblStatusFlow').className = 'control-label text-red';
                                bootbox.alert(`Claim rejected. Reason: ${reason}`);
                            } else {
                                alert("Please enter a reason of at least 5 characters !");
                                return false;
                            }
                        }
                    },
                    cancel: {
                        label: 'Cancel',
                        className: 'btn-danger'
                    }
                }
            });
        }

        function handleCopy() {
            bootbox.confirm("Copy this document?", (res) => {
                if (res) {
                    document.getElementById('txtID').value = '';
                    document.getElementById('txtDocNo').value = '';
                    document.getElementById('lblStatusFlow').textContent = 'NEW';
                    document.getElementById('lblStatusFlow').className = 'control-label text-blue';
                    bootbox.alert("Claim duplicated! Ready to edit and save as a new record.");
                }
            });
        }

        function handleViewMemo() {
            bootbox.confirm("View Attachment MKPP?", (res) => {
                if (res) {
                    let grandTotal = 0;
                    detailRows.forEach(item => {
                        if (item.include) {
                            const pphAmount = Math.floor(item.invoiceAmount * (item.pphTarif / 100));
                            const finalAmount = item.invoiceAmount - pphAmount;
                            const ppnAmount = item.ppnAmount || 0;
                            grandTotal += (finalAmount + ppnAmount);
                        }
                    });
                    bootbox.alert("<h4>MEMO PREVIEW</h4><p>Memo for Claim: <strong>" + (document.getElementById('txtDocNo').value || "NEW") + "</strong></p><p>Supplier: " + (document.getElementById('txtSupplierName').value || "-") + "</p><p>Amount: IDR " + formatCurrency(grandTotal) + "</p>");
                }
            });
        }
    </script>
</body>
</html>

