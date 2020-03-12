// ############################################################################### //

// Taxonomy Loader and Editor
// Luke Thorburn, November 2019

// To start local server:
// python -m http.server 8888

// ############################################################################### //
// LOAD DATA

var items;

Papa.parse("../data/items.csv", {
	download: true,
	header: true,
	dynamicTyping: true,
	complete: function(results) {
		items = results.data;
		loadTaxonomy();
		regenerateTaxonomy();
	}
});

// ------------------------------------------------------------------------------- //
// LOAD CONTROLS

loadTaxonomy = function() {

	// Populate axis dropdowns.

	var rowSelect = document.getElementById("row-select"),
		colSelect = document.getElementById("col-select"),
		swapAxes  = document.getElementById("swap-axes");

	dims.forEach(function(d) {
		var opt = '<option value="' + d.title + '">' + d.title + '</option>';
		rowSelect.innerHTML = rowSelect.innerHTML + opt;
		colSelect.innerHTML = colSelect.innerHTML + opt;
	})

	colSelect.value = "Audience";
	rowSelect.value = "Accuracy";

	rowSelect.setAttribute('onchange','regenerateTaxonomy();');
	colSelect.setAttribute('onchange','regenerateTaxonomy();');
	swapAxes.setAttribute('onclick','swapDimensions();');


}


// ------------------------------------------------------------------------------- //
// REFRESH TAXONOMY

regenerateTaxonomy = function() {

	tax = document.querySelector('#taxonomy');

	// Remove existing taxonomy cells.
	document.querySelectorAll(".temp").forEach(function(el) {
		el.remove();
	})

	// Fetch selected dimensions.
	var rowDimVal = document.getElementById("row-select").value,
		colDimVal = document.getElementById("col-select").value,
		rowDim, colDim;
	dims.forEach(function(d) {
		if (d.title == rowDimVal) {
			rowDim = d;
		}
		if (d.title == colDimVal) {
			colDim = d;
		}
	})
	
	// Correct column spacing.
	tax.style.gridTemplateColumns = "auto ".repeat(4) + "1fr ".repeat(colDim.numGroups) + "auto ".repeat(4 - colDim.numGroups) + "auto";


	// Generate dimension labels.
	if (rowDim.type == "partition") {
		rowDim.groups.forEach(function(g, k) {
			tax.insertAdjacentHTML('beforeend', `
				<div class="temp rowname row` + (k+1) + `">
						<strong>` + g.label + `</strong> ` + g.description + `
				</div>
			`);
		});
	} else if (rowDim.type == "venn") {
		tax.insertAdjacentHTML('beforeend', `
			<div class="temp rowname row1">
					<strong>` + rowDim.groups[0].label + `</strong> ` + rowDim.groups[0].description + `
			</div>
			<div class="temp rowname row3">
					<strong>` + rowDim.groups[1].label + `</strong> ` + rowDim.groups[1].description + `
			</div>
		`);
	}
	

	if (colDim.type == "partition") {
		colDim.groups.forEach(function(g, k) {
			tax.insertAdjacentHTML('beforeend', `
				<div class="temp colname col` + (k+1) + `">
						<strong>` + g.label + `</strong> ` + g.description + `
				</div>
			`);
		})
	} else if (colDim.type == "venn") {
		tax.insertAdjacentHTML('beforeend', `
			<div class="temp colname col1">
					<strong>` + colDim.groups[0].label + `</strong> ` + colDim.groups[0].description + `
			</div>
			<div class="temp colname col3">
					<strong>` + colDim.groups[1].label + `</strong> ` + colDim.groups[1].description + `
			</div>
		`);
	}


	
	// Generate Venn cells.
	if (colDim.type == "venn") {
		tax.insertAdjacentHTML('beforeend', `
			<div class="temp venn-col-left"></div>
			<div class="temp venn-col-right"></div>
			<div class="temp venn-col-overlap"></div>
			<div class="temp venn-buffer venn-col-buffer-top-left"></div>
			<div class="temp venn-buffer venn-col-buffer-bottom-right"></div>
		`);
	}

	if (rowDim.type == "venn") {
		tax.insertAdjacentHTML('beforeend', `
			<div class="temp venn-row-top"></div>
			<div class="temp venn-row-bottom"></div>
			<div class="temp venn-row-overlap"></div>
			<div class="temp venn-buffer venn-row-buffer-left-top"></div>
			<div class="temp venn-buffer venn-row-buffer-right-bottom"></div>
		`);
	}

	if (colDim.type == "venn" & rowDim.type == "venn") {
		tax.insertAdjacentHTML('beforeend', `
			<div class="temp venn-overlap row1 col1"></div>
			<div class="temp venn-overlap row1 col2"></div>
			<div class="temp venn-overlap row1 col3"></div>
			<div class="temp venn-overlap row2 col1"></div>
			<div class="temp venn-overlap row2 col2"></div>
			<div class="temp venn-overlap row2 col3"></div>
			<div class="temp venn-overlap row3 col1"></div>
			<div class="temp venn-overlap row3 col2"></div>
			<div class="temp venn-overlap row3 col3"></div>
			<div class="temp venn-buffer venn-col-buffer-top-right"></div>
			<div class="temp venn-buffer venn-col-buffer-bottom-left"></div>
			<div class="temp venn-buffer venn-row-buffer-left-bottom"></div>
			<div class="temp venn-buffer venn-row-buffer-right-top"></div>
		`);
	}

	// Compute which cell items go in.
	items.forEach(function(i) {
		// Compute row number.
		if (rowDim.type == "partition") {
			rowDim.groups.forEach(function(g, k) {
				if (i[g.key]) {
					i.row = k+1;
				}
			})
		} else if (rowDim.type == "venn") {
			if (i[rowDim.groups[0].key] & i[rowDim.groups[1].key]) {
				i.row = 2;
			} else if (i[rowDim.groups[0].key]) {
				i.row = 1;
			} else if (i[rowDim.groups[1].key]) {
				i.row = 3;
			}
		} else if (rowDim.type == "none") {
			i.row = 1;
		}

		// Compute column number.
		if (colDim.type == "partition") {
			colDim.groups.forEach(function(g, k) {
				if (i[g.key]) {
					i.col = k+1;
				}
			})
		} else if (colDim.type == "venn") {
			if (i[colDim.groups[0].key] & i[colDim.groups[1].key]) {
				i.col = 2;
			} else if (i[colDim.groups[0].key]) {
				i.col = 1;
			} else if (i[colDim.groups[1].key]) {
				i.col = 3;
			}
		} else if (colDim.type == "none") {
			i.col = 1;
		}
	})

	// Build and populate cells.
	for (r = 1; r <= rowDim.numGroups; r++) {
		for (c = 1; c <= colDim.numGroups; c++) {
			var cell = '<div class="temp cell row'+ r + ' col' + c + '">';
			items.forEach(function(i) {
				if (i.row == r & i.col == c) {
					cell = cell + `
						<div class="item">` + i.issue + `</div>
					`;
				}
			})
			cell = cell + '</div>';
			tax.insertAdjacentHTML('beforeend', cell);
		}
	}



	// Generate partition lines.
	if (rowDim.type == "partition") {
		for (r = 1; r < rowDim.numGroups; r++) {
			var cells = document.querySelectorAll('.rowname.row' + r);
			for(var i = 0; i < cells.length; i++) {
				cells[i].className = cells[i].className + " bottom-border";
			}
			for (c = 1; c <= colDim.numGroups; c++) {
				var cells = document.querySelectorAll('.cell.row' + r + '.col' + c);
				for(var i = 0; i < cells.length; i++) {
					cells[i].className = cells[i].className + " bottom-border";
				}
			}
		}
	}

	if (colDim.type == "partition") {
		for (c = 1; c < colDim.numGroups; c++) {
			var cells = document.querySelectorAll('.colname.col' + c);
			for(var i = 0; i < cells.length; i++) {
				cells[i].className = cells[i].className + " right-border";
			}
			for (r = 1; r <= rowDim.numGroups; r++) {
				var cells = document.querySelectorAll('.cell.row' + r + '.col' + c);
				for(var i = 0; i < cells.length; i++) {
					cells[i].className = cells[i].className + " right-border";
				}
			}
		}
	}


}

// ------------------------------------------------------------------------------- //
// SWAP DIMENSIONS

swapDimensions = function() {

	var rowSelect = document.getElementById("row-select"),
		colSelect = document.getElementById("col-select");

	// Fetch selected dimensions.
	var rowDimVal = rowSelect.value,
		colDimVal = colSelect.value;
	
	// Change dimensions.
	rowSelect.value = colDimVal;
	colSelect.value = rowDimVal;


	document.getElementById("taxonomy").classList.toggle("swapped");

	// Regenerate.
	regenerateTaxonomy();

}

// ------------------------------------------------------------------------------- //