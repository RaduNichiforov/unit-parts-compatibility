var unitPartsData = {};
document.addEventListener('DOMContentLoaded', function () {
    console.log('Document loaded, initializing data load...');
    loadJSONData();
});
function showLoading(show) {
    var loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = show ? 'block' : 'none';
    }
}
function loadJSONData() {
    showLoading(true);
    var url = 'unit_parts.json'; // Path to your JSON file
    fetch(url)
        .then(function (response) { return response.json(); })
        .then(function (data) {
        unitPartsData = data;
        console.log('JSON data loaded successfully');
        console.log('Available models:', Object.keys(unitPartsData)); // Debugging statement
        showLoading(false);
    })
        .catch(function (error) {
        console.error('Error loading JSON file:', error);
        showLoading(false);
    });
}
function filterUnits() {
    var searchBar = document.getElementById('searchBar');
    var partTypeDropdown = document.getElementById('partTypeDropdown');
    var results = document.getElementById('results');
    var searchTerm = searchBar.value.toLowerCase().trim(); // Normalize search term
    var selectedPartType = partTypeDropdown.value.toLowerCase(); // Normalize selected part type
    console.log('Searching for model:', searchTerm, 'with part type:', selectedPartType);
    console.log('Available models:', Object.keys(unitPartsData)); // Debugging statement
    if (results) {
        results.innerHTML = ''; // Clear previous results
        if (unitPartsData[searchTerm]) {
            console.log('Model found, displaying results');
            var filteredParts = unitPartsData[searchTerm].filter(function (part) {
                if (!part.category) {
                    return selectedPartType === 'accessories'; // Add parts with undefined category to accessories
                }
                var partCategory = part.category.toLowerCase();
                if (selectedPartType === 'accessories') {
                    return partCategory.indexOf('motor') === -1 &&
                        partCategory.indexOf('dust cup') === -1 &&
                        partCategory.indexOf('handle & hose') === -1 &&
                        partCategory.indexOf('wand') === -1 &&
                        partCategory.indexOf('floor nozzle') === -1;
                }
                else {
                    return partCategory.indexOf(selectedPartType) !== -1;
                }
            });
            if (filteredParts.length > 0) {
                var partsGroupedByCategory = groupBy(filteredParts, 'category');
                var _loop_1 = function (category) {
                    var groupDiv = document.createElement('div');
                    groupDiv.className = 'group';
                    var groupTitle = document.createElement('h2');
                    groupTitle.textContent = category || 'Accessories'; // Display 'Accessories' for undefined category
                    groupDiv.appendChild(groupTitle);
                    var ul = document.createElement('ul');
                    partsGroupedByCategory[category].forEach(function (part) {
                        var li = document.createElement('li');
                        li.textContent = "".concat(part.code, " - ").concat(part.part);
                        ul.appendChild(li);
                    });
                    groupDiv.appendChild(ul);
                    results.appendChild(groupDiv);
                };
                for (var category in partsGroupedByCategory) {
                    _loop_1(category);
                }
            }
            else {
                var noResultDiv = document.createElement('div');
                noResultDiv.textContent = 'No compatible parts found for this model and part type.';
                results.appendChild(noResultDiv);
            }
        }
        else {
            console.log('Model not found');
            var noResultDiv = document.createElement('div');
            noResultDiv.textContent = 'Model not found.';
            results.appendChild(noResultDiv);
        }
    }
}
function groupBy(array, key) {
    return array.reduce(function (result, currentValue) {
        var groupKey = String(currentValue[key]);
        if (!result[groupKey]) {
            result[groupKey] = [];
        }
        result[groupKey].push(currentValue);
        return result;
    }, {});
}
