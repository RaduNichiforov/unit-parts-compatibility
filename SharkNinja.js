const unitPartsData = {}; // Assuming this data is being loaded somewhere in your application

function filterUnits() {
    const searchBar = document.getElementById('searchBar');
    const partTypeDropdown = document.getElementById('partTypeDropdown');
    const results = document.getElementById('results');

    const searchTerm = searchBar.value.toLowerCase().trim();
    const selectedPartType = partTypeDropdown.value.toLowerCase().trim();

    console.log('Searching for model:', searchTerm, 'with part type:', selectedPartType);

    results.innerHTML = ''; // Clear previous results

    if (unitPartsData[searchTerm]) {
        console.log('Model found, displaying results');
        const filteredParts = unitPartsData[searchTerm].filter(part => {
            const partCategory = part.category ? part.category.toLowerCase() : 'accessories';
            if (selectedPartType === 'accessories') {
                return !partCategory.includes('motor') &&
                       !partCategory.includes('dust cup') &&
                       !partCategory.includes('handle & hose') &&
                       !partCategory.includes('wand') &&
                       !partCategory.includes('floor nozzle');
            } else {
                return partCategory.includes(selectedPartType);
            }
        });

        if (filteredParts.length > 0) {
            const partsGroupedByCategory = groupBy(filteredParts, 'category');
            for (const category in partsGroupedByCategory) {
                const groupDiv = document.createElement('div');
                groupDiv.className = 'group';

                const groupTitle = document.createElement('h2');
                groupTitle.textContent = category;
                groupDiv.appendChild(groupTitle);

                const list = document.createElement('ul');
                partsGroupedByCategory[category].forEach(part => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${part.code}: ${part.category}`;
                    list.appendChild(listItem);
                });

                groupDiv.appendChild(list);
                results.appendChild(groupDiv);
            }
        } else {
            results.textContent = 'No parts found for this model and part type.';
        }
    } else {
        results.textContent = 'Model not found';
    }
}

function groupBy(array, key) {
    return array.reduce((result, currentValue) => {
        (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
        return result;
    }, {});
}
