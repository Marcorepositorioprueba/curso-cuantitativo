document.addEventListener('DOMContentLoaded', () => {
    const missionPhasesContainer = document.getElementById('mission-phases-container');
    const addPhaseBtn = document.getElementById('add-phase-btn');
    const totalProbabilityValue = document.getElementById('total-probability-value');
    const probabilityBar = document.getElementById('probability-bar');
    const formulaDisplay = document.getElementById('formula-display');

    let phases = [];
    let phaseCounter = 0;

    const initialPhases = [
        { name: 'Lanzamiento del Cohete', probability: 98.5 },
        { name: 'Separación de Etapas', probability: 99.5 },
        { name: 'Navegación y Trayectoria', probability: 99.0 },
        { name: 'Inserción Orbital', probability: 99.2 },
        { name: 'Descenso y Aterrizaje', probability: 97.5 },
    ];

    function calculateTotalProbability() {
        if (phases.length === 0) {
            totalProbabilityValue.textContent = '100.00';
            probabilityBar.style.width = '100%';
            formulaDisplay.innerHTML = '<p>Fórmula: 1.00</p>';
            return;
        }

        const totalProbability = phases.reduce((acc, phase) => acc * (phase.probability / 100), 1);
        const totalPercentage = totalProbability * 100;

        totalProbabilityValue.textContent = totalPercentage.toFixed(2);
        probabilityBar.style.width = totalPercentage + '%';

        // Update formula display
        let formulaString = 'Éxito = ';
        formulaString += phases.map(p => (p.probability / 100).toFixed(3)).join(' &times; ');
        formulaDisplay.innerHTML = `<p>${formulaString}</p>`;
    }

    function renderPhases() {
        missionPhasesContainer.innerHTML = '';
        phases.forEach(phase => {
            const phaseElement = document.createElement('div');
            phaseElement.classList.add('phase');
            phaseElement.setAttribute('data-id', phase.id);

            phaseElement.innerHTML = `
                <div class="phase-header">
                    <input type="text" class="phase-name" value="${phase.name}">
                    <span class="phase-probability-value">${phase.probability.toFixed(1)}%</span>
                </div>
                <input type="range" min="90" max="100" value="${phase.probability}" step="0.1" class="slider">
                <button class="remove-phase-btn">Eliminar</button>
            `;

            missionPhasesContainer.appendChild(phaseElement);
        });
        addEventListenersToPhases();
        calculateTotalProbability();
    }

    function addEventListenersToPhases() {
        document.querySelectorAll('.phase').forEach(phaseElement => {
            const phaseId = parseInt(phaseElement.getAttribute('data-id'));
            const slider = phaseElement.querySelector('.slider');
            const probabilityValueDisplay = phaseElement.querySelector('.phase-probability-value');
            const nameInput = phaseElement.querySelector('.phase-name');
            const removeBtn = phaseElement.querySelector('.remove-phase-btn');

            slider.addEventListener('input', (e) => {
                const newProb = parseFloat(e.target.value);
                const phase = phases.find(p => p.id === phaseId);
                phase.probability = newProb;
                probabilityValueDisplay.textContent = newProb.toFixed(1) + '%';
                calculateTotalProbability();
            });

            nameInput.addEventListener('change', (e) => {
                const newName = e.target.value;
                const phase = phases.find(p => p.id === phaseId);
                phase.name = newName;
            });

            removeBtn.addEventListener('click', () => {
                phases = phases.filter(p => p.id !== phaseId);
                renderPhases();
            });
        });
    }

    addPhaseBtn.addEventListener('click', () => {
        phaseCounter++;
        phases.push({ id: phaseCounter, name: `Nueva Fase ${phaseCounter}`, probability: 99.0 });
        renderPhases();
    });

    function initialize() {
        initialPhases.forEach(p => {
            phaseCounter++;
            phases.push({ id: phaseCounter, ...p });
        });
        renderPhases();
    }

    initialize();
});
