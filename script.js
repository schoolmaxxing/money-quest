document.addEventListener('DOMContentLoaded', () => {
    console.log("DEBUG: Script loaded. DOMContentLoaded fired. Setting up start screen.");

    // --- DOM Elements ---
    const startScreen = document.getElementById('start-screen');
    const mainGameScreen = document.getElementById('main-game');
    const gameOverScreen = document.getElementById('game-over-screen');
    const winScreen = document.getElementById('win-screen');
    const jobOptions = document.querySelectorAll('.job-option');
    const playerNameInput = document.getElementById('playerName');
    const startGameButton = document.getElementById('startGameButton');
    const statPlayerName = document.getElementById('stat-playerName');
    const statAge = document.getElementById('stat-age');
    const statYear = document.getElementById('stat-year');
    const statMonth = document.getElementById('stat-month');
    const statNetMonthlyIncome = document.getElementById('stat-monthly-income');
    const statSavings = document.getElementById('stat-savings');
    const statInvestments = document.getElementById('stat-investments');
    const statDebt = document.getElementById('stat-debt');
    const statHappiness = document.getElementById('stat-happiness');
    const happinessProgressBar = document.getElementById('happiness-progress-bar');
    const statHouseOwned = document.getElementById('stat-house-owned');
    const statCarsOwned = document.getElementById('stat-cars-owned');
    const statEconomy = document.getElementById('stat-economy');
    const monthlyIncomeDisplay = document.getElementById('monthly-income-display');
    const taxRateDisplay = document.getElementById('tax-rate-display');
    const budgetInputs = {
        housing: document.getElementById('budget-housing'),
        food: document.getElementById('budget-food'),
        utilities: document.getElementById('budget-utilities'),
        transport: document.getElementById('budget-transport'),
        fun: document.getElementById('budget-fun')
    };
    const budgetValues = {
        housing: document.getElementById('housing-value'),
        food: document.getElementById('food-value'),
        utilities: document.getElementById('utilities-value'),
        transport: document.getElementById('transport-value'),
        fun: document.getElementById('fun-value')
    };
    const minDisplays = {
        housing: document.getElementById('housing-min-display'),
        food: document.getElementById('food-min-display'),
        utilities: document.getElementById('utilities-min-display'),
        transport: document.getElementById('transport-min-display')
    };
    const totalAllocatedDisplay = document.getElementById('total-allocated');
    const remainingForSavingsDisplay = document.getElementById('remaining-for-savings');
    const totalPortfolioValueDisplay = document.getElementById('total-portfolio-value-display');
    const stockMarketOptionsContainer = document.getElementById('stock-market-options');
    const stockSelectDropdown = document.getElementById('stock-select');
    const sharesAmountInput = document.getElementById('shares-amount');
    const buySharesButton = document.getElementById('buy-shares-button');
    const sellSharesButton = document.getElementById('sell-shares-button');
    const simMonthButton = document.getElementById('sim-month-button');
    const discretionaryItemsContainer = document.getElementById('discretionary-items');
    const majorPurchasesContainer = document.getElementById('major-purchases-section');
    const buySmallHouseButton = document.getElementById('buy-small-house-button');
    const buyMediumHouseButton = document.getElementById('buy-medium-house-button');
    const buyCarButton = document.getElementById('buy-car-button');

    const logList = document.getElementById('log-list');
    const achievementsList = document.getElementById('achievements-list');
    const gameOverTitle = document.getElementById('game-over-title');
    const gameOverMessage = document.getElementById('game-over-message');
    const restartGameButton = document.getElementById('restart-game-button');
    const restartGameWinButton = document.getElementById('restart-game-win-button');
    const winStatsList = document.getElementById('win-stats');
    const eventModal = $('#eventModal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');

    // --- Game State Variables ---
    let playerName, age, currentYear, currentMonthIndex, annualIncome, netMonthlyIncome, incomeTaxRate, economyState,
        savings, debt, happiness, difficulty,
        happinessDecayCounter, prolongedDebtCounter, lowFunSpendingStreak, stagnationStreakCounter, isSimulatingMonth, lowHappinessStreakCounter;

    let playerOwnsHouse = "none";
    let housePurchaseCost = 0;
    let carsOwned = 0;
    const maxCars = 5;

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const economyHappinessImpact = {
        "Boom": 1,
        "Normal": 0,
        "Recession": -12
    };
    const economyTaxImpact = {
        "Boom": 0.02,
        "Normal": 0,
        "Recession": -0.02
    };

    const winConditionNetWorth = 3000000;
    const retirementAge = 65;
    const maxDebt = 250000;
    const debtInterestRate = 0.05 / 12;
    const happinessLossThreshold = 15;
    const maxActiveQuests = 3;

    const lowFunThresholdPercent = 0.025;
    const lowFunStreakThreshold = 2;
    const happinessDecayRate = -3;
    const prolongedDebtThresholdMonths = 3;
    const prolongedDebtPenalty = -5;
    const stagnationWealthThreshold = 40000;
    const stagnationLowFunThreshold = 0.04;
    const stagnationStreakThreshold = 3;
    const stagnationPenalty = -4;
    const lowHappinessPenaltyThreshold = 30;
    const lowHappinessStreakForPenalty = 3;

    let portfolio = {};
    const stockDefinitions = {
        "AMZN": {
            name: "Amazon (AMZN)",
            symbol: "AMZN",
            risk: "High",
            initialPrice: 150,
            currentPrice: 150,
            baseReturn: {
                "Boom": 0.035,
                "Normal": 0.012,
                "Recession": -0.025
            },
            volatility: 0.06,
            history: []
        },
        "AAPL": {
            name: "Apple (AAPL)",
            symbol: "AAPL",
            risk: "Medium-High",
            initialPrice: 170,
            currentPrice: 170,
            baseReturn: {
                "Boom": 0.025,
                "Normal": 0.01,
                "Recession": -0.015
            },
            volatility: 0.04,
            history: []
        },
        "JNJ": {
            name: "Johnson & Johnson (JNJ)",
            symbol: "JNJ",
            risk: "Low",
            initialPrice: 160,
            currentPrice: 160,
            baseReturn: {
                "Boom": 0.01,
                "Normal": 0.006,
                "Recession": 0.002
            },
            volatility: 0.02,
            history: []
        },
        "MSFT": {
            name: "Microsoft (MSFT)",
            symbol: "MSFT",
            risk: "Medium",
            initialPrice: 300,
            currentPrice: 300,
            baseReturn: {
                "Boom": 0.028,
                "Normal": 0.011,
                "Recession": -0.01
            },
            volatility: 0.035,
            history: []
        }
    };
    const stockPriceHistoryLength = 5;
    let portfolioValueAtMonthStart = 0;

    let minMonthlyCosts = {
        housing: 500,
        food: 150,
        utilities: 75,
        transport: 50
    };
    let currentMonthlyBudget = {
        ...minMonthlyCosts,
        fun: 50
    };

    let activeQuests = [];
    let completedQuestIds = new Set();
    const allPossibleQuests = [{
            id: 'frugalFeet',
            name: 'Frugal Feet',
            description: 'Go 2 months without "luxury" or "shoes".',
            duration: 2,
            progress: 0,
            reward: {
                happiness: 4,
                money: 600,
                annualIncomeBoost: 1200
            },
            typesToAvoid: ['luxury', 'shoes'],
            condition: () => true
        },
        {
            id: 'starterHome',
            name: 'Home Sweet Home',
            description: 'Buy your first house.',
            reward: {
                happiness: 15,
                annualIncomeBoost: 2000
            },
            condition: () => playerOwnsHouse === "none",
            oneTime: true
        },
        {
            id: 'mansionOwner',
            name: 'Mansion Owner',
            description: 'Own the Medium Family House.',
            reward: {
                happiness: 10
            },
            condition: () => playerOwnsHouse !== "medium",
            oneTime: true,
            customCheck: () => playerOwnsHouse === "medium"
        },
        {
            id: 'emergencyFundLg',
            name: 'Emergency Stash',
            description: 'Reach $15,000 in savings.',
            targetSavings: 15000,
            reward: {
                happiness: 10,
                money: 750,
                annualIncomeBoost: 2000
            },
            condition: () => age < 35 && savings < 15000
        },
        {
            id: 'debtDestroyer',
            name: 'Debt Destroyer',
            description: 'Pay off all outstanding debt.',
            reward: {
                happiness: 25,
                annualIncomeBoost: 5000
            },
            condition: () => debt > 0,
            oneTime: true,
            customCheck: () => debt <= 0
        },
        {
            id: 'consistentSaverAdv',
            name: 'Steady Saver',
            description: 'Save over 25% of net income for 3 months.',
            duration: 3,
            progress: 0,
            savingsRateTarget: 0.25,
            reward: {
                happiness: 7,
                money: 1000,
                annualIncomeBoost: 3000
            },
            condition: () => true
        },
        {
            id: 'noDebtYear',
            name: 'Debt-Free Year',
            description: 'Remain debt-free for an entire year.',
            duration: 12,
            progress: 0,
            reward: {
                happiness: 10,
                annualIncomeBoost: 4500
            },
            condition: () => true,
            customCheckMonthly: () => debt <= 0
        },
        {
            id: 'firstInvestment',
            name: 'Market Entry',
            description: 'Make your first stock investment (min $500).',
            reward: {
                happiness: 3,
                money: 150
            },
            condition: () => Object.keys(portfolio || {}).length === 0,
            oneTime: true,
            customCheck: () => Object.keys(portfolio || {}).length > 0 && calculateTotalPortfolioValue() >= 500
        },
        {
            id: 'portfolioStarter',
            name: 'Growing Acorns',
            description: 'Grow portfolio to $7,500.',
            targetPortfolioValue: 7500,
            reward: {
                happiness: 7,
                money: 400,
                annualIncomeBoost: 1200
            },
            condition: () => calculateTotalPortfolioValue() < 7500
        },
        {
            id: 'diversifier',
            name: 'Diversified Investor',
            description: 'Own shares in at least 2 different stocks.',
            targetUniqueStocks: 2,
            reward: {
                happiness: 5,
                annualIncomeBoost: 1500
            },
            condition: () => true,
            customCheck: () => Object.keys(portfolio || {}).length >= 2
        },
        {
            id: 'bullRider',
            name: 'Ride the Bull',
            description: 'Achieve a 15% gain in portfolio in a "Boom" year.',
            yearPortfolioGrowthTarget: 0.15,
            economyTarget: "Boom",
            reward: {
                happiness: 10,
                money: 1500,
                annualIncomeBoost: 3000
            },
            condition: () => economyState === "Boom",
            isYearlyQuest: true
        },
        {
            id: 'recessionResilience',
            name: 'Weather the Storm',
            description: 'Avoid losing more than 7% of portfolio in a "Recession" year.',
            maxPortfolioLossTarget: 0.07,
            economyTarget: "Recession",
            reward: {
                happiness: 8,
                money: 800,
                annualIncomeBoost: 2500
            },
            condition: () => economyState === "Recession",
            isYearlyQuest: true
        },
        {
            id: 'diamondHands',
            name: 'Steady Hand (AMZN)',
            description: 'Hold AMZN stock for 9 months without selling any of its shares.',
            duration: 9,
            progress: 0,
            stockSymbolToHold: "AMZN",
            reward: {
                happiness: 5,
                money: 400
            },
            condition: () => portfolio && portfolio["AMZN"] && portfolio["AMZN"].shares > 0 && portfolio["AMZN"].initialSharesForDiamondHands > 0,
            tracksStockHolding: true
        },
        {
            id: 'bigWinStock',
            name: 'Lucky Pick',
            description: 'Gain 75% on a single stock holding (value becomes 1.75x total buy cost).',
            reward: {
                happiness: 15,
                money: 750
            },
            condition: () => true,
            customCheck: () => checkForStockDouble(1.75)
        },
        {
            id: 'netWorthIntermediate',
            name: 'Solid Foundation',
            description: 'Reach a net worth of $250,000.',
            targetNetWorth: 250000,
            reward: {
                happiness: 15,
                annualIncomeBoost: 5000
            },
            condition: () => (savings + calculateTotalPortfolioValue()) < 250000
        },
        {
            id: 'netWorthAdvanced',
            name: 'Millionaire Prep',
            description: 'Reach a net worth of $750,000.',
            targetNetWorth: 750000,
            reward: {
                happiness: 25,
                annualIncomeBoost: 8000
            },
            condition: () => (savings + calculateTotalPortfolioValue()) < 750000
        },
        {
            id: 'minimalistLife',
            name: 'Lean Living',
            description: 'Keep total expenses below 40% of net income for 4 months.',
            duration: 4,
            progress: 0,
            expenseRateTarget: 0.40,
            reward: {
                happiness: 8,
                money: 2000,
                annualIncomeBoost: 1000
            },
            condition: () => true
        },
        {
            id: 'hobbyMaster',
            name: 'Passionate Pursuit',
            description: 'Spend $3,000 on "Leisure/Fun" in a single year.',
            yearFunSpendTarget: 3000,
            reward: {
                happiness: 4,
                money: -250
            },
            condition: () => true,
            isYearlyQuest: true
        },
        {
            id: 'worldTraveler',
            name: 'Weekend Explorer',
            description: 'Take 2 "Luxury Vacations" or 4 "Weekend Getaways".',
            progress: 0,
            reward: {
                happiness: 10
            },
            condition: () => true,
            customCheck: () => (countPurchasedItems("Luxury Vacation") >= 2 || countPurchasedItems("Weekend Getaway") >= 4)
        },
        {
            id: 'shoeCollector',
            name: 'Shoe Fanatic',
            description: 'Own 3 pairs of "Fancy Shoes".',
            targetItemCount: 3,
            progress: 0,
            itemTypeToTrack: 'shoes',
            itemNameSubstring: "Shoes",
            reward: {
                happiness: 1
            },
            condition: () => true
        },
        {
            id: 'gadgetGuru',
            name: 'Tech Enthusiast',
            description: 'Own 3 different "High-Tech Gadgets".',
            targetItemCount: 3,
            progress: 0,
            itemTypeToTrack: 'luxury',
            itemNameSubstring: "Gadget",
            reward: {
                happiness: 2,
                annualIncomeBoost: 800
            },
            condition: () => true
        },
        {
            id: 'bigPromotion',
            name: 'Career Milestone',
            description: 'Increase gross annual income by $30,000 from your starting income for quests.',
            incomeIncreaseTarget: 30000,
            reward: {
                happiness: 15,
                annualIncomeBoost: 7000
            },
            condition: () => true,
            usesInitialIncome: true
        },
        {
            id: 'consistentEarner',
            name: 'Reliable Earner',
            description: 'Maintain a gross annual income above $80,000 for 1.5 years (18 months).',
            duration: 18,
            progress: 0,
            incomeThreshold: 80000,
            reward: {
                happiness: 12,
                annualIncomeBoost: 6000
            },
            condition: () => true,
            customCheckMonthly: () => annualIncome >= 80000
        },
        {
            id: 'marketCrashSurvivor',
            name: 'Market Crash Survivor',
            description: 'Experience a year where your portfolio loses >15% and don\'t sell any stocks during that year.',
            yearPortfolioLossMin: 0.15,
            reward: {
                happiness: 5,
                money: 1000
            },
            condition: () => true,
            isYearlyQuest: true,
            tracksSalesDuringCrash: true
        },
        {
            id: 'allInOneStock',
            name: 'Focused Bet',
            description: 'Have >80% of your portfolio in a single stock for 2 months (min $5k total).',
            duration: 2,
            progress: 0,
            singleStockConcentration: 0.80,
            minPortfolioValue: 5000,
            reward: {
                happiness: -3,
                money: 500,
                annualIncomeBoost: 500
            },
            condition: () => calculateTotalPortfolioValue() >= 5000,
            customCheckMonthly: () => checkStockConcentration(0.80)
        },
        {
            id: 'autoEnthusiast',
            name: 'Auto Enthusiast',
            description: 'Own 3 cars.',
            targetCarCount: 3,
            reward: {
                happiness: 10,
                money: 1000
            },
            condition: () => carsOwned < 3,
            customCheck: () => carsOwned >= 3
        },
        {
            id: 'luxuryFleet',
            name: 'Luxury Fleet',
            description: 'Own the maximum of 5 cars.',
            targetCarCount: 5,
            reward: {
                happiness: 25,
                annualIncomeBoost: 5000
            },
            condition: () => carsOwned < 5,
            customCheck: () => carsOwned >= 5
        }
    ];
    let initialAnnualIncomeForQuests = 0;
    let yearlyQuestTrackers = {};
    let purchasedItemCounts = {};


    // --- Game Setup ---
    function selectScreen(screenId) {
        console.log(`DEBUG: Selecting screen: ${screenId}`);
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
        } else {
            console.error(`DEBUG: Screen with ID ${screenId} not found!`);
        }
    }

    if (jobOptions && jobOptions.length > 0) {
        jobOptions.forEach(button => {
            button.addEventListener('click', (event) => {
                const clickedButtonText = event.target.textContent.trim().substring(0, 30);
                console.log(`DEBUG: Job option CLICKED: "${clickedButtonText}"`);
                jobOptions.forEach(btn => {
                    btn.classList.remove('selected');
                });
                button.classList.add('selected');
                console.log(`DEBUG: Added .selected to: "${clickedButtonText}". Current classes: "${button.className}"`);
                const newlySelectedJobByQuery = document.querySelector('.job-option.selected');
                if (newlySelectedJobByQuery) {
                    console.log(`DEBUG: VERIFICATION - querySelector found selected job: "${newlySelectedJobByQuery.textContent.trim().substring(0,30)}"`);
                } else {
                    console.error('DEBUG: CRITICAL FAILURE - querySelector did NOT find any ".job-option.selected" immediately after adding the class!');
                }
            });
        });
    } else {
        console.error("DEBUG: jobOptions NodeList is empty or not found! Check HTML class 'job-option'.");
    }

    if (startGameButton) {
        startGameButton.addEventListener('click', () => {
            console.log("DEBUG: Start Journey button clicked.");
            const selectedJob = document.querySelector('.job-option.selected');
            if (!selectedJob) {
                console.log("DEBUG: startGameButton - NO JOB SELECTED according to querySelector.");
                showModal("Selection Needed", "Please select an income level to start!");
                return;
            }
            const incomeStr = selectedJob.dataset.income;
            playerName = playerNameInput && playerNameInput.value ? playerNameInput.value.trim() : "UVA Alum";
            annualIncome = parseInt(incomeStr);
            difficulty = selectedJob.dataset.difficulty;
            if (isNaN(annualIncome)) {
                console.error("DEBUG: Annual Income is NaN after parsing job selection. Value was:", incomeStr);
                showModal("Error", "Could not determine income from job selection.");
                return;
            }
            console.log("DEBUG: Parsed - PlayerName:", playerName, "AnnualIncome:", annualIncome, "Difficulty:", difficulty);
            try {
                initializeGame();
                console.log("DEBUG: initializeGame call completed from startGameButton.");
            } catch (error) {
                console.error("DEBUG: Error during initializeGame call from startGameButton:", error, error.stack);
                alert("An error occurred while starting the game. Please check the console (F12).");
            }
        });
    } else {
        console.error("CRITICAL DEBUG: startGameButton element not found! Check HTML ID.");
    }

    function initializeGame() {
        console.log("DEBUG: initializeGame STARTED.");
        try {
            isSimulatingMonth = false;
            age = 21;
            currentYear = 2024;
            currentMonthIndex = 0;
            savings = 0;
            debt = 0;
            happiness = 60;
            playerOwnsHouse = "none";
            housePurchaseCost = 0;
            carsOwned = 0;
            economyState = "Normal";
            incomeTaxRate = 0.20;
            if (logList) logList.innerHTML = "";
            else console.error("DEBUG: logList element not found in initializeGame");

            activeQuests = [];
            completedQuestIds.clear();
            portfolio = {};
            Object.values(stockDefinitions).forEach(stock => {
                stock.currentPrice = stock.initialPrice;
                stock.history = [];
            });
            yearlyQuestTrackers = {
                funSpentThisYear: 0,
                portfolioValueAtYearStart: calculateTotalPortfolioValue(),
                soldDuringCrashYear: false,
                inCrashYear: (economyState === "Recession")
            };
            purchasedItemCounts = {};
            console.log("DEBUG: Yearly trackers reset in initializeGame:", yearlyQuestTrackers);

            happinessDecayCounter = 0;
            prolongedDebtCounter = 0;
            lowFunSpendingStreak = 0;
            stagnationStreakCounter = 0;
            lowHappinessStreakCounter = 0;
            initialAnnualIncomeForQuests = annualIncome;
            console.log("DEBUG: Basic variables reset. Initial Annual Income for Quests:", initialAnnualIncomeForQuests);

            let grossMonthlyIncome = Math.round(annualIncome / 12);
            let currentTaxRate = incomeTaxRate + (economyTaxImpact[economyState] || 0);
            netMonthlyIncome = grossMonthlyIncome - Math.round(grossMonthlyIncome * currentTaxRate);
            console.log("DEBUG: Net monthly income calculated:", netMonthlyIncome);

            minMonthlyCosts.housing = playerOwnsHouse !== "none" ? 0 : Math.max(300, Math.round(netMonthlyIncome * 0.30));
            minMonthlyCosts.food = Math.max(100, Math.round(netMonthlyIncome * 0.10));
            minMonthlyCosts.utilities = Math.max(50, Math.round(netMonthlyIncome * 0.08));
            minMonthlyCosts.transport = Math.max(30, Math.round(netMonthlyIncome * 0.05));
            currentMonthlyBudget = {
                ...minMonthlyCosts,
                fun: Math.max(20, Math.round(netMonthlyIncome * 0.05))
            };
            console.log("DEBUG: Min costs and current budget set.");

            updateMinMaxForSliders();
            setBudgetSlidersToCurrentBudget();
            updateCostDisplaysAndMinValues();
            updateBudgetDisplays();
            setupStockMarketUI();
            updateInvestmentUIDisplay();
            generateNewQuests();
            updateStatsBar();

            addLog(`Game Started! Player: ${playerName}. Gross Annual Income: $${annualIncome.toLocaleString()}.`);
            addLog(`Net Monthly Income: $${netMonthlyIncome.toLocaleString()} after approx. tax.`);
            addLog(`Goal: Reach $${winConditionNetWorth.toLocaleString()} net worth by age ${retirementAge}.`);

            selectScreen('main-game');
            console.log("DEBUG: initializeGame FINISHED SUCCESSFULLY.");
        } catch (error) {
            console.error("DEBUG: CRITICAL ERROR in initializeGame:", error, error.stack);
            alert("A critical error occurred during game initialization. Check console (F12).");
            selectScreen('start-screen');
        }
    }

    function updateMinMaxForSliders() {
        const incomeBasedMaxFactor = 0.7;
        try {
            if (budgetInputs.housing) {
                budgetInputs.housing.min = playerOwnsHouse !== "none" ? 0 : (minMonthlyCosts.housing || 0);
                budgetInputs.housing.max = playerOwnsHouse !== "none" ? 0 : Math.max((minMonthlyCosts.housing || 0), Math.round(netMonthlyIncome * incomeBasedMaxFactor));
            } else console.error("DEBUG: budgetInputs.housing is null in updateMinMaxForSliders");
            if (budgetInputs.food) {
                budgetInputs.food.min = minMonthlyCosts.food || 0;
                budgetInputs.food.max = Math.max((minMonthlyCosts.food || 0), Math.round(netMonthlyIncome * 0.30));
            } else console.error("DEBUG: budgetInputs.food is null");
            if (budgetInputs.utilities) {
                budgetInputs.utilities.min = minMonthlyCosts.utilities || 0;
                budgetInputs.utilities.max = Math.max((minMonthlyCosts.utilities || 0), Math.round(netMonthlyIncome * 0.20));
            } else console.error("DEBUG: budgetInputs.utilities is null");
            if (budgetInputs.transport) {
                budgetInputs.transport.min = minMonthlyCosts.transport || 0;
                budgetInputs.transport.max = Math.max((minMonthlyCosts.transport || 0), Math.round(netMonthlyIncome * 0.20));
            } else console.error("DEBUG: budgetInputs.transport is null");
            if (budgetInputs.fun) {
                budgetInputs.fun.min = 0;
                budgetInputs.fun.max = Math.max(0, Math.round(netMonthlyIncome * 0.35));
            } else console.error("DEBUG: budgetInputs.fun is null");

            for (const category in budgetInputs) {
                let input = budgetInputs[category];
                if (input) {
                    input.value = Math.max(parseInt(input.min) || 0, Math.min(parseInt(input.value) || 0, parseInt(input.max) || Number.MAX_SAFE_INTEGER));
                    if (currentMonthlyBudget[category] !== undefined) {
                        currentMonthlyBudget[category] = parseInt(input.value);
                    }
                }
            }
        } catch (e) {
            console.error("DEBUG: Error in updateMinMaxForSliders:", e.stack);
        }
    }

    function setBudgetSlidersToCurrentBudget() {
        try {
            for (const category in budgetInputs) {
                if (currentMonthlyBudget.hasOwnProperty(category) && budgetInputs[category]) {
                    budgetInputs[category].value = Math.max(parseInt(budgetInputs[category].min) || 0, Math.min(currentMonthlyBudget[category], parseInt(budgetInputs[category].max) || Number.MAX_SAFE_INTEGER));
                }
            }
        } catch (e) {
            console.error("DEBUG: Error in setBudgetSlidersToCurrentBudget:", e.stack);
        }
    }

    function updateStatsBar() {
        try {
            if (statPlayerName) statPlayerName.textContent = playerName || "N/A";
            if (statAge) statAge.textContent = age || 0;
            if (statYear) statYear.textContent = currentYear || 0;
            if (statMonth) statMonth.textContent = months[currentMonthIndex] || "N/A";
            if (statNetMonthlyIncome) statNetMonthlyIncome.textContent = (netMonthlyIncome || 0).toLocaleString();
            if (statSavings) statSavings.textContent = (savings || 0).toLocaleString();
            if (statInvestments) statInvestments.textContent = calculateTotalPortfolioValue().toLocaleString();
            if (statDebt) statDebt.textContent = (debt || 0).toLocaleString();
            if (statHappiness) statHappiness.textContent = Math.round(happiness || 0);
            if (happinessProgressBar) {
                let currentHappiness = Math.round(happiness || 0);
                happinessProgressBar.style.width = `${currentHappiness}%`;
                happinessProgressBar.setAttribute('aria-valuenow', currentHappiness);
            }
            if (statHouseOwned) statHouseOwned.textContent = playerOwnsHouse === "none" ? "None" : playerOwnsHouse.charAt(0).toUpperCase() + playerOwnsHouse.slice(1);
            if (statCarsOwned) statCarsOwned.textContent = carsOwned || 0;
            if (statEconomy) statEconomy.textContent = economyState || "N/A";
            if (taxRateDisplay) taxRateDisplay.textContent = ((incomeTaxRate + (economyTaxImpact[economyState] || 0)) * 100).toFixed(1);

            if (buySmallHouseButton) buySmallHouseButton.disabled = (playerOwnsHouse !== "none");
            if (buyMediumHouseButton) buyMediumHouseButton.disabled = (playerOwnsHouse === "medium");
            if (buyCarButton) buyCarButton.disabled = (carsOwned >= maxCars);

        } catch (e) {
            console.error("DEBUG: Error in updateStatsBar", e.stack);
        }
    }

    function updateCostDisplaysAndMinValues() {
        try {
            if (minDisplays.housing) minDisplays.housing.textContent = playerOwnsHouse !== "none" ? "0 (Owned)" : (minMonthlyCosts.housing || 0).toLocaleString();
            if (minDisplays.food) minDisplays.food.textContent = (minMonthlyCosts.food || 0).toLocaleString();
            if (minDisplays.utilities) minDisplays.utilities.textContent = (minMonthlyCosts.utilities || 0).toLocaleString();
            if (minDisplays.transport) minDisplays.transport.textContent = (minMonthlyCosts.transport || 0).toLocaleString();

            if (budgetInputs.housing) {
                budgetInputs.housing.disabled = (playerOwnsHouse !== "none");
                if (playerOwnsHouse !== "none") {
                    budgetInputs.housing.value = 0;
                    if (budgetValues.housing) budgetValues.housing.textContent = "0 (Owned)";
                } else if (budgetValues.housing) {
                    budgetValues.housing.textContent = (parseInt(budgetInputs.housing.value) || 0).toLocaleString();
                }
            }
            for (const category in budgetValues) {
                if (category !== 'housing' && budgetInputs[category] && budgetValues[category]) {
                    budgetValues[category].textContent = (parseInt(budgetInputs[category].value) || 0).toLocaleString();
                }
            }
        } catch (e) {
            console.error("DEBUG: Error in updateCostDisplaysAndMinValues", e.stack);
        }
    }

    function updateBudgetDisplays() {
        try {
            if (monthlyIncomeDisplay) monthlyIncomeDisplay.textContent = (netMonthlyIncome || 0).toLocaleString();
            let totalAllocated = 0;
            for (const category in budgetInputs) {
                if (!budgetInputs[category]) {
                    continue;
                }
                let value = parseInt(budgetInputs[category].value) || 0;
                if (playerOwnsHouse !== "none" && category === 'housing') value = 0;

                if (!(playerOwnsHouse !== "none" && category === 'housing') && minMonthlyCosts[category] !== undefined) {
                    if (value < minMonthlyCosts[category]) {
                        value = minMonthlyCosts[category];
                        budgetInputs[category].value = value;
                    }
                }
                if (budgetValues[category]) budgetValues[category].textContent = value.toLocaleString();
                totalAllocated += value;
            }
            if (totalAllocatedDisplay) totalAllocatedDisplay.textContent = totalAllocated.toLocaleString();
            const remaining = netMonthlyIncome - totalAllocated;
            if (remainingForSavingsDisplay) {
                remainingForSavingsDisplay.textContent = remaining.toLocaleString();
                remainingForSavingsDisplay.style.color = remaining < 0 ? '#e06c75' : '#98c379';
            }
        } catch (e) {
            console.error("DEBUG: Error in updateBudgetDisplays", e.stack);
        }
    }

    Object.entries(budgetInputs).forEach(([category, input]) => {
        if (input) {
            input.addEventListener('input', () => {
                if (!input) return;
                let value = parseInt(input.value) || 0;
                let minVal = (playerOwnsHouse !== "none" && category === 'housing') ? 0 : (minMonthlyCosts[category] || 0);
                if (value < minVal) input.value = minVal;
                currentMonthlyBudget[category] = parseInt(input.value);
                updateBudgetDisplays();
            });
        }
    });

    function addLog(message) {
        if (logList) {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<strong>[${months[currentMonthIndex]} ${currentYear}]</strong> ${message}`;
            logList.prepend(listItem);
            if (logList.children.length > 40) logList.removeChild(logList.lastChild);
        }
    }

    function showModal(title, message) {
        if (modalTitle) modalTitle.textContent = title;
        if (modalMessage) modalMessage.innerHTML = message;
        eventModal.modal('show');
    }

    // --- Investment System ---
    function setupStockMarketUI() {
        console.log("DEBUG: setupStockMarketUI started.");
        if (!stockMarketOptionsContainer || !stockSelectDropdown) {
            console.error("DEBUG: Stock market UI elements (container or dropdown) not found in setupStockMarketUI!");
            return;
        }
        stockMarketOptionsContainer.innerHTML = "";
        stockSelectDropdown.innerHTML = "";

        for (const stockId in stockDefinitions) {
            const stock = stockDefinitions[stockId];
            if (!stock) {
                console.warn(`DEBUG: Undefined stock definition for ID ${stockId}`);
                continue;
            }

            const option = document.createElement('option');
            option.value = stockId;
            option.textContent = `${stock.name} (${stock.symbol || 'N/A'})`;
            stockSelectDropdown.appendChild(option);

            const stockDiv = document.createElement('div');
            stockDiv.classList.add('stock-item', 'mb-2');
            stockDiv.id = `stock-info-${stockId}`;
            stockMarketOptionsContainer.appendChild(stockDiv);
            updateStockInfoDisplay(stockDiv, stockId);
        }
        console.log("DEBUG: setupStockMarketUI finished.");
    }

    function updateStockInfoDisplay(stockDivOrId, stockIdToUpdate) {
        let stockDiv = typeof stockDivOrId === 'string' ? document.getElementById(stockDivOrId) : stockDivOrId;
        if (!stockDiv) {
            return;
        }
        const stock = stockDefinitions[stockIdToUpdate];
        if (!stock) {
            console.error(`DEBUG: Stock definition for ${stockIdToUpdate} missing in updateStockInfoDisplay.`);
            return;
        }
        const playerHolding = portfolio[stockIdToUpdate] || {
            shares: 0
        };
        let historyText = "No history.";
        if (stock.history && stock.history.length > 0) {
            historyText = stock.history.slice(-stockPriceHistoryLength).map(h => `${h.changePercent !== undefined ? h.changePercent.toFixed(2) : 'N/A'}%`).join(', ');
        }
        let sentimentText = "Neutral 😐";
        let sentimentClass = "neutral";
        if (stock.history && stock.history.length > 0) {
            const recentHistory = stock.history.slice(-Math.min(3, stock.history.length));
            if (recentHistory.length > 0) {
                const recentPerformance = recentHistory.reduce((sum, h) => sum + (h.changePercent || 0), 0) / recentHistory.length;
                if (recentPerformance > 1.5) {
                    sentimentText = `Bullish 📈 (${recentPerformance.toFixed(1)}%)`;
                    sentimentClass = "bullish";
                } else if (recentPerformance < -1.5) {
                    sentimentText = `Bearish 📉 (${recentPerformance.toFixed(1)}%)`;
                    sentimentClass = "bearish";
                } else if (Math.abs(recentPerformance) > 0.5) {
                    sentimentText = `Trending ${recentPerformance > 0 ? 'Up' : 'Down'} (${recentPerformance.toFixed(1)}%)`;
                    sentimentClass = recentPerformance > 0 ? "bullish" : "bearish";
                }
            }
        }
        stockDiv.innerHTML = `
            <p><strong>${stock.name} (${stock.symbol || 'N/A'})</strong> - Risk: ${stock.risk || 'N/A'}</p>
            <p>Price: $<span id="price-${stockIdToUpdate}">${stock.currentPrice ? stock.currentPrice.toFixed(2) : 'N/A'}</span> | Owned: <span id="owned-${stockIdToUpdate}">${playerHolding.shares}</span></p>
            <p class="stock-history small">Recent Trend (MoM %): ${historyText}</p>
            <p class="stock-sentiment small ${sentimentClass}">Sentiment: ${sentimentText}</p>
        `;
    }

    function calculateTotalPortfolioValue() {
        let totalValue = 0;
        for (const stockId in portfolio) {
            if (portfolio[stockId] && stockDefinitions[stockId] && stockDefinitions[stockId].currentPrice !== undefined) {
                totalValue += portfolio[stockId].shares * stockDefinitions[stockId].currentPrice;
            }
        }
        return Math.round(totalValue);
    }

    function updateInvestmentUIDisplay() {
        if (!totalPortfolioValueDisplay) {
            console.error("DEBUG: totalPortfolioValueDisplay not found");
            return;
        }
        const totalValue = calculateTotalPortfolioValue();
        totalPortfolioValueDisplay.textContent = totalValue.toLocaleString();
        if (statInvestments) statInvestments.textContent = totalValue.toLocaleString();
        for (const stockId in stockDefinitions) {
            updateStockInfoDisplay(`stock-info-${stockId}`, stockId);
        }
    }

    if (buySharesButton) {
        buySharesButton.addEventListener('click', () => {
            if (!stockSelectDropdown || !sharesAmountInput) {
                console.error("DEBUG: Buy shares UI elements missing.");
                return;
            }
            const stockId = stockSelectDropdown.value;
            const shares = parseInt(sharesAmountInput.value);
            if (!stockId || isNaN(shares) || shares <= 0) {
                showModal("Invalid Input", "Select stock & enter valid shares.");
                return;
            }
            const stock = stockDefinitions[stockId];
            if (!stock || stock.currentPrice === undefined) {
                showModal("Stock Error", "Selected stock data is unavailable.");
                return;
            }
            const cost = shares * stock.currentPrice;
            if (cost > savings) {
                showModal("Insufficient Savings", `Need $${cost.toLocaleString()}. You have $${savings.toLocaleString()}.`);
                return;
            }
            savings -= cost;
            if (!portfolio[stockId]) portfolio[stockId] = {
                shares: 0,
                totalBuyCost: 0,
                name: stock.name,
                symbol: stock.symbol,
                initialSharesForDiamondHands: 0
            };
            portfolio[stockId].totalBuyCost = (portfolio[stockId].totalBuyCost || 0) + cost;
            const oldShares = portfolio[stockId].shares;
            portfolio[stockId].shares += shares;
            if (oldShares === 0 && shares > 0 && stockId === "AMZN") { // Specifically for Diamond Hands (AMZN)
                portfolio[stockId].initialSharesForDiamondHands = shares;
            } else if (stockId === "AMZN" && portfolio[stockId].initialSharesForDiamondHands === 0 && shares > 0) { // If they sold all AMZN and rebuy for Diamond Hands
                portfolio[stockId].initialSharesForDiamondHands = shares;
            }

            addLog(`Bought ${shares} shares of ${stock.symbol} for $${cost.toLocaleString()}.`);
            if (sharesAmountInput) sharesAmountInput.value = "";
            updateStatsBar();
            updateInvestmentUIDisplay();

            const firstInvQuest = activeQuests.find(q => q.id === 'firstInvestment' && !q.completed);
            if (firstInvQuest && firstInvQuest.customCheck && firstInvQuest.customCheck()) {
                checkAndCompleteQuest('firstInvestment');
            }

            const aggrInvestQuest = activeQuests.find(q => q.id === 'aggressiveInvestor' && !q.completed);
            if (aggrInvestQuest && cost >= aggrInvestQuest.minInvestmentAmount && (savings + cost) > 0 && cost / (savings + cost) >= aggrInvestQuest.savingsInvestedPercent) {
                checkAndCompleteQuest('aggressiveInvestor');
            }
            const diversifierQuest = activeQuests.find(q => q.id === 'diversifier' && !q.completed);
            if (diversifierQuest && diversifierQuest.customCheck && diversifierQuest.customCheck()) {
                checkAndCompleteQuest('diversifier');
            }
        });
    } else console.error("DEBUG: buySharesButton not found");

    if (sellSharesButton) {
        sellSharesButton.addEventListener('click', () => {
            if (!stockSelectDropdown || !sharesAmountInput) {
                console.error("DEBUG: Sell shares UI elements missing.");
                return;
            }
            const stockId = stockSelectDropdown.value;
            const sharesToSell = parseInt(sharesAmountInput.value);
            if (!stockId || isNaN(sharesToSell) || sharesToSell <= 0) {
                showModal("Invalid Input", "Select stock & valid shares to sell.");
                return;
            }
            const stock = stockDefinitions[stockId];
            if (!stock || stock.currentPrice === undefined) {
                showModal("Stock Error", "Selected stock data is unavailable.");
                return;
            }
            if (!portfolio[stockId] || portfolio[stockId].shares < sharesToSell) {
                showModal("Not Enough Shares", `You don't own ${sharesToSell} of ${stock.symbol}.`);
                return;
            }

            const diamondQuest = activeQuests.find(q => q.id === 'diamondHands' && !q.completed && q.stockSymbolToHold === stock.symbol);
            if (diamondQuest && portfolio[stockId].shares > 0 && sharesToSell > 0) {
                addLog(`Selling ${stock.symbol} reset Diamond Hands quest progress.`);
                diamondQuest.progress = 0;
                // When selling, if they still own some, update initialSharesForDiamondHands to current shares.
                // If they sell all, initialSharesForDiamondHands becomes 0.
                portfolio[stockId].initialSharesForDiamondHands = Math.max(0, portfolio[stockId].shares - sharesToSell);
            }
            if (yearlyQuestTrackers.inCrashYear) yearlyQuestTrackers.soldDuringCrashYear = true;

            const proceeds = sharesToSell * stock.currentPrice;
            savings += proceeds;
            if (portfolio[stockId].shares > 0 && portfolio[stockId].shares !== sharesToSell) {
                const proportionRemaining = (portfolio[stockId].shares - sharesToSell) / portfolio[stockId].shares;
                portfolio[stockId].totalBuyCost = (portfolio[stockId].totalBuyCost || 0) * proportionRemaining;
            } else if (portfolio[stockId].shares === sharesToSell) {
                portfolio[stockId].totalBuyCost = 0;
            }
            portfolio[stockId].shares -= sharesToSell;
            if (portfolio[stockId].shares <= 0) delete portfolio[stockId];
            addLog(`Sold ${sharesToSell} shares of ${stock.symbol} for $${proceeds.toLocaleString()}.`);
            if (sharesAmountInput) sharesAmountInput.value = "";
            updateStatsBar();
            updateInvestmentUIDisplay();
        });
    } else console.error("DEBUG: sellSharesButton not found");

    function updateStockPrices() {
        portfolioValueAtMonthStart = calculateTotalPortfolioValue();
        for (const stockId in stockDefinitions) {
            const stock = stockDefinitions[stockId];
            if (!stock) {
                console.warn(`DEBUG: Missing stock definition for ${stockId} in updateStockPrices`);
                continue;
            }
            const economy = economyState || "Normal";
            const stockBaseReturn = stock.baseReturn || {};
            const marketFactors = stockBaseReturn[economy];
            if (marketFactors === undefined) {
                console.warn(`DEBUG: Missing market factors for ${stockId} (baseReturn.${economy}) in economy ${economy}. Using 0.`);
            }
            let randomVolatility = (Math.random() * 2 - 1) * (stock.volatility || 0);
            let priceChangePercent = (marketFactors || 0) + randomVolatility;
            stock.currentPrice = (stock.currentPrice || stock.initialPrice) * (1 + priceChangePercent);
            stock.currentPrice = Math.max(0.01, stock.currentPrice);
            if (!stock.history) stock.history = [];
            stock.history.push({
                price: stock.currentPrice,
                changePercent: priceChangePercent * 100
            });
            if (stock.history.length > stockPriceHistoryLength) stock.history.shift();
        }
        updateInvestmentUIDisplay();

        const portfolioChange = calculateTotalPortfolioValue() - portfolioValueAtMonthStart;
        if (portfolioValueAtMonthStart > 100) {
            const percentChange = portfolioValueAtMonthStart !== 0 ? portfolioChange / portfolioValueAtMonthStart : 0;
            if (percentChange > 0.03) {
                happiness += 1;
                addLog(`Positive market moves boosted your mood! Happiness +1. Portfolio changed by ${(percentChange * 100).toFixed(1)}%`);
            } else if (percentChange < -0.04) {
                happiness -= 2;
                addLog(`Market downturn is stressing you out! Happiness -2. Portfolio changed by ${(percentChange * 100).toFixed(1)}%`);
            }
        }
    }

    // --- Quest System ---
    function generateNewQuests() {
        console.log("DEBUG: generateNewQuests started.");
        const incompleteActiveQuests = activeQuests.filter(q => !q.completed);
        let questsToAdd = maxActiveQuests - incompleteActiveQuests.length;
        // console.log(`DEBUG: Quests to add: ${questsToAdd}, Incomplete active: ${incompleteActiveQuests.length}`);

        if (questsToAdd <= 0) {
            // console.log("DEBUG: No quest slots to fill or max active quests reached.");
            updateQuestsDisplay();
            return;
        }

        const availablePool = allPossibleQuests.filter(pq => {
            const isCompleted = completedQuestIds.has(pq.id);
            const isActive = activeQuests.some(aq => aq.id === pq.id);
            let meetsCondition = false;
            try {
                if (typeof pq.condition !== 'function') {
                    console.warn(`DEBUG: Quest ${pq.id} has no valid condition function.`);
                    meetsCondition = false;
                } else {
                    meetsCondition = pq.condition();
                }
            } catch (e) {
                console.error(`DEBUG: Error in condition for quest ${pq.id}:`, e.stack);
                meetsCondition = false;
            }
            return !isCompleted && !isActive && meetsCondition;
        });
        // console.log(`DEBUG: Quest generation - Available pool size: ${availablePool.length}`);

        let questsAddedThisCall = 0;
        for (let i = 0; i < questsToAdd && availablePool.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * availablePool.length);
            const newQuestTemplate = availablePool.splice(randomIndex, 1)[0];
            const newQuestInstance = {
                ...newQuestTemplate,
                progress: 0,
                completed: false
            };

            if (newQuestInstance.id === 'debtAnnihilator' && debt > 0) newQuestInstance.initialDebt = debt;
            else if (newQuestInstance.id === 'debtAnnihilator' && debt <= 0) continue;

            if (newQuestInstance.usesInitialIncome) newQuestInstance.initialAnnualIncomeForQuest = initialAnnualIncomeForQuests;

            if (newQuestInstance.isYearlyQuest) {
                newQuestInstance.initialPortfolioValueForYearlyQuests = calculateTotalPortfolioValue();
            }
            if (newQuestInstance.tracksStockHolding && newQuestInstance.stockSymbolToHold) {
                const stockIdToTrack = Object.keys(stockDefinitions).find(id => stockDefinitions[id].symbol === newQuestInstance.stockSymbolToHold);
                if (stockIdToTrack && portfolio[stockIdToTrack] && portfolio[stockIdToTrack].shares > 0) {
                    newQuestInstance.initialSharesForDiamondHands = portfolio[stockIdToTrack].shares;
                } else {
                    newQuestInstance.initialSharesForDiamondHands = 0;
                }
            }

            activeQuests.push(newQuestInstance);
            addLog(`New Quest: ${newQuestInstance.name}`);
            questsAddedThisCall++;
        }
        // console.log(`DEBUG: Quest generation - Quests added this call: ${questsAddedThisCall}`);
        updateQuestsDisplay();
        // console.log("DEBUG: generateNewQuests finished.");
    }

    function updateQuestsDisplay() {
        if (!achievementsList) {
            console.error("DEBUG: achievementsList element not found for quest display");
            return;
        }
        achievementsList.innerHTML = "";
        const questsToDisplay = activeQuests.filter(q => !q.completed);

        questsToDisplay.forEach(quest => {
            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item', 'quest-incomplete');
            let progressText = "";
            if (quest.duration && quest.duration > 0 && !quest.completed) progressText += ` (${quest.progress || 0}/${quest.duration} months)`;
            if (quest.targetSavings && !quest.completed) progressText += ` (S: $${Math.min(savings, quest.targetSavings).toLocaleString()}/$${quest.targetSavings.toLocaleString()})`;
            if (quest.targetPortfolioValue && !quest.completed) progressText += ` (Port: $${Math.min(calculateTotalPortfolioValue(), quest.targetPortfolioValue).toLocaleString()}/$${quest.targetPortfolioValue.toLocaleString()})`;
            if (quest.targetNetWorth && !quest.completed) progressText += ` (NW: $${Math.min(savings + calculateTotalPortfolioValue(), quest.targetNetWorth).toLocaleString()}/$${quest.targetNetWorth.toLocaleString()})`;
            if (quest.targetItemCount && !quest.completed && quest.itemNameSubstring) progressText += ` (${purchasedItemCounts[quest.itemNameSubstring] || 0}/${quest.targetItemCount} ${quest.itemNameSubstring}(s))`;
            else if (quest.targetItemCount && !quest.completed) progressText += ` (${quest.progress || 0}/${quest.targetItemCount} bought)`; // Fallback for generic item counts
            if (quest.targetUniqueStocks && !quest.completed) progressText += ` (${Math.min(Object.keys(portfolio || {}).length, quest.targetUniqueStocks)}/${quest.targetUniqueStocks} stocks)`;
            listItem.textContent = `${quest.name}: ${quest.description}${progressText}`;
            achievementsList.appendChild(listItem);
        });
        // console.log(`DEBUG: updateQuestsDisplay executed. Displaying ${questsToDisplay.length} quests.`);
    }

    function checkAndCompleteQuest(questId, params = {}) {
        console.log(`DEBUG: Attempting to complete quest: ${questId}`);
        const questIndex = activeQuests.findIndex(q => q.id === questId && !q.completed);
        if (questIndex === -1) {
            return;
        }
        const quest = activeQuests[questIndex];
        quest.completed = true;
        completedQuestIds.add(quest.id);

        let rewardMsg = "Quest Reward: ";
        if (quest.reward) {
            if (quest.reward.happiness) {
                happiness += quest.reward.happiness;
                rewardMsg += `+${quest.reward.happiness} Hap. `;
            }
            if (quest.reward.money) {
                savings += quest.reward.money;
                rewardMsg += `+$${quest.reward.money.toLocaleString()} Sav. `;
            }
            if (quest.reward.annualIncomeBoost) {
                annualIncome += quest.reward.annualIncomeBoost;
                rewardMsg += `Annual Income +$${quest.reward.annualIncomeBoost.toLocaleString()}! `;
                let grossMonthlyIncome = Math.round(annualIncome / 12);
                let currentTaxRate = incomeTaxRate + (economyTaxImpact[economyState] || 0);
                netMonthlyIncome = grossMonthlyIncome - Math.round(grossMonthlyIncome * currentTaxRate);
            }
        }
        addLog(`QUEST COMPLETED: ${quest.name}! ${rewardMsg}`);
        showModal("Quest Completed!", `You completed: ${quest.name}! ${rewardMsg}`);

        activeQuests.splice(questIndex, 1);
        updateQuestsDisplay();
        generateNewQuests();
        console.log(`DEBUG: Quest ${questId} completed and removed. Active quests: ${activeQuests.length}`);
    }

    function updateQuestProgress(actionParams = {}) {
        if (!activeQuests || activeQuests.length === 0) return;
        activeQuests.filter(q => !q.completed).forEach(quest => {
            let progressMadeThisMonth = false;
            if (quest.customCheck) {
                try {
                    if (quest.customCheck()) {
                        checkAndCompleteQuest(quest.id);
                        progressMadeThisMonth = true;
                        return;
                    }
                } catch (e) {
                    console.error(`DEBUG: Error in customCheck for ${quest.id}:`, e.stack);
                }
            }
            if (quest.oneTime && !progressMadeThisMonth && quest.id !== 'starterHome' && quest.id !== 'mansionOwner' && quest.id !== 'firstInvestment') {
                return;
            }

            switch (quest.id) {
                case 'frugalFeet':
                case 'luxuryAbstinence':
                    progressMadeThisMonth = true;
                    if (actionParams.itemTypeBought && quest.typesToAvoid && quest.typesToAvoid.includes(actionParams.itemTypeBought)) {
                        if (quest.progress > 0) addLog(`${quest.name} progress reset.`);
                        quest.progress = 0;
                    } else {
                        quest.progress++;
                    }
                    if (quest.progress >= quest.duration) checkAndCompleteQuest(quest.id);
                    break;
                case 'emergencyFundLg':
                    progressMadeThisMonth = true;
                    if (savings >= quest.targetSavings) checkAndCompleteQuest(quest.id);
                    break;
                case 'consistentSaverAdv':
                    progressMadeThisMonth = true;
                    if (actionParams.savedThisMonthPercent !== undefined && netMonthlyIncome > 0) {
                        if (actionParams.savedThisMonthPercent >= quest.savingsRateTarget) quest.progress++;
                        else {
                            if (quest.progress > 0) addLog(`${quest.name} progress reset.`);
                            quest.progress = 0;
                        }
                    } else if (netMonthlyIncome <= 0 && quest.savingsRateTarget > 0) {
                        if (quest.progress > 0) addLog(`${quest.name} progress reset.`);
                        quest.progress = 0;
                    }
                    if (quest.progress >= quest.duration) checkAndCompleteQuest(quest.id);
                    break;
                case 'noDebtYear':
                    progressMadeThisMonth = true;
                    if (quest.customCheckMonthly && quest.customCheckMonthly()) quest.progress++;
                    else {
                        if (quest.progress > 0) addLog(`${quest.name} progress reset.`);
                        quest.progress = 0;
                    }
                    if (quest.progress >= quest.duration) checkAndCompleteQuest(quest.id);
                    break;
                case 'portfolioStarter':
                case 'marketMaster':
                    progressMadeThisMonth = true;
                    if (calculateTotalPortfolioValue() >= quest.targetPortfolioValue) checkAndCompleteQuest(quest.id);
                    break;
                case 'netWorthIntermediate':
                case 'netWorthAdvanced':
                    progressMadeThisMonth = true;
                    if ((savings + calculateTotalPortfolioValue()) >= quest.targetNetWorth) checkAndCompleteQuest(quest.id);
                    break;
                case 'diamondHands':
                    progressMadeThisMonth = true;
                    const stockIdForDiamond = Object.keys(stockDefinitions).find(id => stockDefinitions[id].symbol === quest.stockSymbolToHold);
                    const holdingForDiamond = stockIdForDiamond ? portfolio[stockIdForDiamond] : null;
                    if (holdingForDiamond && holdingForDiamond.shares >= (quest.initialSharesForDiamondHands || 1) && (quest.initialSharesForDiamondHands || 0) > 0) quest.progress++;
                    else {
                        if (quest.progress > 0 && holdingForDiamond) addLog(`${quest.name} progress reset.`);
                        quest.progress = 0;
                        if (holdingForDiamond) quest.initialSharesForDiamondHands = holdingForDiamond.shares;
                        else if (quest.initialSharesForDiamondHands !== undefined) quest.initialSharesForDiamondHands = 0;
                    }
                    if (quest.progress >= quest.duration) checkAndCompleteQuest(quest.id);
                    break;
                case 'minimalistLife':
                    progressMadeThisMonth = true;
                    if (netMonthlyIncome > 0 && actionParams.currentMonthTotalExpenses !== undefined) {
                        if (actionParams.currentMonthTotalExpenses / netMonthlyIncome <= quest.expenseRateTarget) quest.progress++;
                        else {
                            if (quest.progress > 0) addLog(`${quest.name} progress reset.`);
                            quest.progress = 0;
                        }
                    } else if (netMonthlyIncome <= 0 && quest.expenseRateTarget > 0) {
                        if (quest.progress > 0) addLog(`${quest.name} progress reset.`);
                        quest.progress = 0;
                    }
                    if (quest.progress >= quest.duration) checkAndCompleteQuest(quest.id);
                    break;
                case 'worldTraveler':
                case 'shoeCollector':
                case 'gadgetGuru':
                    progressMadeThisMonth = true; // Logic for these moved to customCheck using purchasedItemCounts
                    break;
                case 'bigPromotion':
                    progressMadeThisMonth = true;
                    if (quest.usesInitialIncome && annualIncome >= initialAnnualIncomeForQuests + quest.incomeIncreaseTarget) checkAndCompleteQuest(quest.id);
                    break;
                case 'consistentEarner':
                    progressMadeThisMonth = true;
                    if (quest.customCheckMonthly && quest.customCheckMonthly()) quest.progress++;
                    else {
                        if (quest.progress > 0) addLog(`${quest.name} progress reset.`);
                        quest.progress = 0;
                    }
                    if (quest.progress >= quest.duration) checkAndCompleteQuest(quest.id);
                    break;
                case 'debtAnnihilator':
                    progressMadeThisMonth = true;
                    quest.progress = (quest.progress || 0) + 1;
                    if (quest.customCheck && quest.customCheck()) {
                        checkAndCompleteQuest(quest.id);
                        break;
                    }
                    if (quest.progress >= quest.duration && !quest.completed) {
                        const isCompletedByPaydown = debt <= ((quest.initialDebt || 0) - quest.debtPaydownTarget);
                        if (!isCompletedByPaydown && debt > 0) {
                            addLog(`Quest Failed: ${quest.name} - Time ran out.`);
                            completedQuestIds.add(quest.id);
                            activeQuests = activeQuests.filter(q_item => q_item.id !== quest.id);
                        } else if (isCompletedByPaydown) {
                            checkAndCompleteQuest(quest.id);
                        }
                    }
                    break;
                case 'bullRider':
                case 'recessionResilience':
                case 'hobbyMaster':
                case 'marketCrashSurvivor':
                    progressMadeThisMonth = true;
                    break;
                case 'allInOneStock':
                    progressMadeThisMonth = true;
                    if (quest.customCheckMonthly && quest.customCheckMonthly()) quest.progress++;
                    else {
                        if (quest.progress > 0) addLog(`${quest.name} progress reset.`);
                        quest.progress = 0;
                    }
                    if (quest.progress >= quest.duration) checkAndCompleteQuest(quest.id);
                    break;
                case 'autoEnthusiast':
                case 'luxuryFleet':
                    progressMadeThisMonth = true;
                    if (quest.customCheck && quest.customCheck()) checkAndCompleteQuest(quest.id);
                    break;
                default:
                    if (!progressMadeThisMonth && !quest.oneTime && !quest.customCheck && !quest.isYearlyQuest && !quest.tracksStockHolding) {
                        console.warn(`DEBUG: Quest ${quest.id} (${quest.name}) no specific monthly progress logic in updateQuestProgress's switch and wasn't handled by flags.`);
                    }
                    break;
            }
        });
        updateQuestsDisplay();
    }

    // --- Core Game Logic ---
    function simulateMonth() {
        if (isSimulatingMonth) {
            console.log("DEBUG: Simulation already in progress, skipping.");
            return;
        }
        isSimulatingMonth = true;
        if (simMonthButton) simMonthButton.disabled = true;
        console.log(`DEBUG: simulateMonth CALLED for ${months[currentMonthIndex]} ${currentYear}. Age: ${age}. Happiness: ${happiness.toFixed(1)}`);

        try {
            let grossMonthlyIncome = Math.round(annualIncome / 12);
            let currentTaxRate = incomeTaxRate + (economyTaxImpact[economyState] || 0);
            netMonthlyIncome = grossMonthlyIncome - Math.round(grossMonthlyIncome * currentTaxRate);
            if (currentMonthIndex === 0) addLog(`Net income this month: $${netMonthlyIncome.toLocaleString()} (after approx. $${(grossMonthlyIncome - netMonthlyIncome).toLocaleString()} tax).`);

            let currentMonthExpenses = 0;
            let funSpentThisMonth = 0;
            let happinessFromSpending = 0;
            for (const category in currentMonthlyBudget) {
                let val = parseInt(budgetInputs[category] ? budgetInputs[category].value : currentMonthlyBudget[category]) || 0;
                if (playerOwnsHouse !== "none" && category === 'housing') val = 0;
                currentMonthExpenses += val;
                if (category === 'fun') funSpentThisMonth = val;
                if (category === 'fun' && val > (minMonthlyCosts.fun || 0) * 1.5) happinessFromSpending += 0.5;
            }
            happiness += Math.min(0.5, happinessFromSpending);
            yearlyQuestTrackers.funSpentThisYear = (yearlyQuestTrackers.funSpentThisYear || 0) + funSpentThisMonth;

            let netAfterBudget = netMonthlyIncome - currentMonthExpenses;
            let savedThisMonthAmount = 0;
            if (netAfterBudget >= 0) {
                savings += netAfterBudget;
                savedThisMonthAmount = netAfterBudget;
                if (netAfterBudget > 0) addLog(`Saved $${netAfterBudget.toLocaleString()} this month.`);
            } else {
                const shortfall = Math.abs(netAfterBudget);
                addLog(`DEFICIT: Expenses ($${currentMonthExpenses.toLocaleString()}) exceeded net income ($${netMonthlyIncome.toLocaleString()})! Shortfall: $${shortfall.toLocaleString()}.`);
                if (savings >= shortfall) {
                    savings -= shortfall;
                    addLog(`Covered shortfall from savings.`);
                } else {
                    debt += (shortfall - savings);
                    savings = 0;
                    happiness -= 35;
                    addLog(`Savings depleted! Incurred $${(shortfall - savings).toLocaleString()} new debt. Happiness severely impacted.`);
                }
            }

            if (debt > 0) {
                const interest = Math.round(debt * debtInterestRate);
                debt += interest;
                if (interest > 0) addLog(`Paid $${interest.toLocaleString()} in debt interest.`);
                happiness -= 10;
                prolongedDebtCounter++;
                if (prolongedDebtCounter >= prolongedDebtThresholdMonths) {
                    happiness += prolongedDebtPenalty;
                    addLog(`Prolonged debt is crushing your spirit! Happiness ${prolongedDebtPenalty}.`);
                }
            } else {
                prolongedDebtCounter = 0;
            }

            updateStockPrices();

            let actionParams = {
                funSpentThisMonth: funSpentThisMonth,
                savedThisMonthPercent: grossMonthlyIncome > 0 ? savedThisMonthAmount / grossMonthlyIncome : 0,
                currentMonthTotalExpenses: currentMonthExpenses,
            };
            updateQuestProgress(actionParams);

            if (funSpentThisMonth < netMonthlyIncome * lowFunThresholdPercent && netMonthlyIncome > 0) lowFunSpendingStreak++;
            else lowFunSpendingStreak = 0;
            if (lowFunSpendingStreak >= lowFunStreakThreshold) {
                happiness += happinessDecayRate;
                addLog(`Life feels dull from lack of leisure. Happiness ${happinessDecayRate}.`);
            }

            if (savings > stagnationWealthThreshold && funSpentThisMonth < netMonthlyIncome * stagnationLowFunThreshold && netMonthlyIncome > 0) stagnationStreakCounter++;
            else stagnationStreakCounter = 0;
            if (stagnationStreakCounter >= stagnationStreakThreshold) {
                happiness += stagnationPenalty;
                addLog(`Wealth isn't everything if life isn't enjoyed. Feeling stagnant. Happiness ${stagnationPenalty}.`);
            }

            if (happiness < lowHappinessPenaltyThreshold) {
                lowHappinessStreakCounter++;
                if (lowHappinessStreakCounter >= lowHappinessStreakForPenalty) {
                    happiness -= 2;
                    addLog("Persistent low mood is taking a toll. Happiness -2.");
                    if (Math.random() < 0.25) {
                        let incomeHit = Math.round(netMonthlyIncome * (Math.random() * 0.05 + 0.05));
                        savings -= incomeHit;
                        if (savings < 0) {
                            debt += Math.abs(savings);
                            savings = 0;
                        }
                        happiness -= 5;
                        showModal("Productivity Dip!", `Your low mood affected your work. Lost $${incomeHit.toLocaleString()} from this month's potential income (deducted from savings/added to debt). Happiness -5.`);
                        addLog(`Productivity dip due to low happiness. Financial hit of $${incomeHit.toLocaleString()}.`);
                    }
                    lowHappinessStreakCounter = 0;
                }
            } else {
                lowHappinessStreakCounter = 0;
            }

            let gotPayRaiseThisMonth = false;
            currentMonthIndex++;
            if (currentMonthIndex > 11) {
                currentMonthIndex = 0;
                currentYear++;
                age++;
                console.log(`DEBUG: NEW YEAR! ${currentYear}, Age: ${age}`);
                addLog(`Happy New Year ${currentYear}! You are ${age}.`);
                updateEconomy();
                happiness += (economyHappinessImpact[economyState] || 0);
                console.log(`DEBUG: Yearly economy happiness impact: ${economyHappinessImpact[economyState] || 0} for ${economyState}`);

                yearlyQuestTrackers.portfolioValueAtYearStartNext = calculateTotalPortfolioValue();

                activeQuests.filter(q => q.isYearlyQuest && !q.completed).forEach(quest => {
                    let currentPortfolioValue = calculateTotalPortfolioValue();
                    let startOfYearPortfolio = quest.initialPortfolioValueForYearlyQuests !== undefined ? quest.initialPortfolioValueForYearlyQuests : yearlyQuestTrackers.portfolioValueAtYearStart;

                    if (quest.id === 'bullRider' && economyState === quest.economyTarget) {
                        if (startOfYearPortfolio > 0 && (currentPortfolioValue - startOfYearPortfolio) / startOfYearPortfolio >= quest.yearPortfolioGrowthTarget) checkAndCompleteQuest(quest.id);
                    } else if (quest.id === 'recessionResilience' && economyState === quest.economyTarget) {
                        const portfolioChangePercent = startOfYearPortfolio > 0 ? (currentPortfolioValue - startOfYearPortfolio) / startOfYearPortfolio : 0;
                        if (portfolioChangePercent >= -quest.maxPortfolioLossTarget) checkAndCompleteQuest(quest.id);
                    } else if (quest.id === 'marketCrashSurvivor' && startOfYearPortfolio > 0) {
                        const portfolioLossPercent = startOfYearPortfolio > 0 ? (startOfYearPortfolio - currentPortfolioValue) / startOfYearPortfolio : 0;
                        if (portfolioLossPercent >= quest.yearPortfolioLossMin && !yearlyQuestTrackers.soldDuringCrashYear) checkAndCompleteQuest(quest.id);
                    } else if (quest.id === 'hobbyMaster' && yearlyQuestTrackers.funSpentThisYear >= quest.yearFunSpendTarget) {
                        checkAndCompleteQuest(quest.id);
                    }
                    if (quest.isYearlyQuest && !quest.completed) quest.initialPortfolioValueForYearlyQuests = currentPortfolioValue;
                });
                yearlyQuestTrackers.funSpentThisYear = 0;
                yearlyQuestTrackers.portfolioValueAtYearStart = yearlyQuestTrackers.portfolioValueAtYearStartNext;
                yearlyQuestTrackers.soldDuringCrashYear = false;
                yearlyQuestTrackers.inCrashYear = (economyState === "Recession");

                if (age % 2 === 0 && age < 55 && annualIncome < 500000) {
                    const raisePercentage = (Math.random() * 0.02 + 0.01) * (economyState === "Boom" ? 1.5 : economyState === "Recession" ? 0.4 : 1);
                    const raiseAmount = Math.round(annualIncome * raisePercentage);
                    if (raiseAmount > 0) {
                        annualIncome += raiseAmount;
                        gotPayRaiseThisMonth = true;
                        addLog(`Annual raise: $${raiseAmount.toLocaleString()}. New Gross Annual: $${annualIncome.toLocaleString()}`);
                    }
                }
                if (age % 4 === 0) {
                    const inflationRate = economyState === "Boom" ? 1.08 : economyState === "Recession" ? 1.01 : 1.04;
                    minMonthlyCosts.food = Math.round(minMonthlyCosts.food * inflationRate);
                    minMonthlyCosts.utilities = Math.round(minMonthlyCosts.utilities * inflationRate);
                    minMonthlyCosts.transport = Math.round(minMonthlyCosts.transport * (inflationRate * 0.8));
                    if (playerOwnsHouse === "none") minMonthlyCosts.housing = Math.round(minMonthlyCosts.housing * (inflationRate * 1.2));
                    addLog("Cost of living adjustment. Min expenses updated.");
                }
                updateMinMaxForSliders();
            }
            updateQuestProgress({
                gotPayRaise: gotPayRaiseThisMonth
            });

            happiness = Math.max(0, Math.min(100, happiness));
            if (happiness < happinessLossThreshold && !gameOverScreen.classList.contains('active')) {
                gameOver(`Happiness critically low (${Math.round(happiness)}%)!`);
                isSimulatingMonth = false;
                if (simMonthButton) simMonthButton.disabled = false;
                return;
            }

            generateNewQuests();
            updateStatsBar();
            updateCostDisplaysAndMinValues();
            setBudgetSlidersToCurrentBudget();
            updateBudgetDisplays();

            let netWorth = savings + calculateTotalPortfolioValue();
            if (debt > maxDebt && !gameOverScreen.classList.contains('active')) {
                gameOver(`Debt over $${maxDebt.toLocaleString()}!`);
                isSimulatingMonth = false;
                if (simMonthButton) simMonthButton.disabled = false;
                return;
            }
            if (age >= retirementAge && !gameOverScreen.classList.contains('active') && !winScreen.classList.contains('active')) {
                if (netWorth >= winConditionNetWorth) winGame(netWorth);
                else gameOver(`Retired at ${age} with $${netWorth.toLocaleString()}, falling short of the $${winConditionNetWorth.toLocaleString()} goal.`);
                isSimulatingMonth = false;
                if (simMonthButton) simMonthButton.disabled = false;
                return;
            }
            if (Math.random() < 0.22) triggerRandomEvent();
            console.log("DEBUG: simulateMonth FINISHED SUCCESSFULLY.");

        } catch (error) {
            console.error("DEBUG: CRITICAL ERROR in simulateMonth:", error, error.stack);
            alert("An error occurred during month simulation. Check console (F12).");
        } finally {
            isSimulatingMonth = false;
            if (simMonthButton) simMonthButton.disabled = false;
        }
    }

    function updateEconomy() {
        const rand = Math.random();
        let previousEconomy = economyState;
        if (economyState === "Normal") {
            if (rand < 0.15) economyState = "Boom";
            else if (rand < 0.30) economyState = "Recession";
        } else if (economyState === "Boom") {
            if (rand < 0.40) economyState = "Normal";
        } else if (economyState === "Recession") {
            if (rand < 0.50) economyState = "Normal";
        }
        if (previousEconomy !== economyState) {
            addLog(`The economy has shifted from ${previousEconomy} to ${economyState}.`);
            showModal("Economic Shift!", `The economy is now in a state of ${economyState}.`);
            console.log(`DEBUG: Economy changed to ${economyState}`);
            yearlyQuestTrackers.portfolioValueAtYearStart = calculateTotalPortfolioValue();
            yearlyQuestTrackers.inCrashYear = (economyState === "Recession");
            activeQuests.forEach(q => {
                if (q.isYearlyQuest && (q.economyTarget || q.yearPortfolioGrowthTarget !== undefined || q.maxPortfolioLossTarget !== undefined || q.yearPortfolioLossMin !== undefined)) {
                    q.initialPortfolioValueForYearlyQuests = calculateTotalPortfolioValue();
                }
            });
        }
    }

    function handlePurchase(itemElement) {
        if (!itemElement || !itemElement.dataset) {
            console.error("DEBUG: handlePurchase called with invalid itemElement");
            return;
        }
        // Use dataset.itemName first, then dataset.name, then fallback to textContent
        const itemNameFromData = itemElement.dataset.itemName || itemElement.dataset.name || itemElement.textContent.split('(')[0].trim();
        console.log("DEBUG: handlePurchase called for item:", itemNameFromData);

        const cost = parseInt(itemElement.dataset.cost);
        let happinessBonus = parseInt(itemElement.dataset.happiness);
        const itemType = itemElement.dataset.type;
        const houseTypeData = itemElement.dataset.houseType; // For houses

        if (isNaN(cost) || isNaN(happinessBonus)) {
            console.error("DEBUG: Invalid cost or happiness bonus for item:", itemNameFromData, itemElement.dataset);
            showModal("Data Error", `Item ${itemNameFromData} has invalid data. Purchase cancelled.`);
            return;
        }
        console.log(`DEBUG: Attempting to purchase "${itemNameFromData}". Cost: ${cost}, Happiness Bonus (raw): ${happinessBonus}, Type: ${itemType}`);

        // Harsher happiness bonus reduction if already happy (not for houses/cars)
        if (happiness > 70 && itemType !== 'house' && itemType !== 'car') {
            happinessBonus = Math.floor(happinessBonus * 0.4);
            console.log(`DEBUG: Happiness > 70, bonus adjusted to: ${happinessBonus}`);
        } else if (happiness > 85 && itemType !== 'house' && itemType !== 'car') {
            happinessBonus = 0;
            console.log(`DEBUG: Happiness > 85, bonus adjusted to: ${happinessBonus}`);
        }

        if (savings >= cost) {
            savings -= cost;
            happiness += happinessBonus;
            happiness = Math.max(0, Math.min(100, happiness)); // Clamp happiness

            if (itemType === 'house') {
                console.log("DEBUG: Processing 'house' purchase in handlePurchase.");
                let previousHouseCost = 0; // Not used in current logic but kept for potential future refund ideas

                if (houseTypeData === "small" && playerOwnsHouse === "none") {
                    playerOwnsHouse = "small";
                    housePurchaseCost = cost;
                    addLog(`Bought Small Starter House for $${cost.toLocaleString()}. Happiness +${happinessBonus}.`);
                } else if (houseTypeData === "medium" && (playerOwnsHouse === "none" || playerOwnsHouse === "small")) {
                    addLog(`Bought Medium Family House for $${cost.toLocaleString()}. ${playerOwnsHouse === "small" ? "Upgraded." : ""} Happiness +${happinessBonus}.`);
                    playerOwnsHouse = "medium";
                    housePurchaseCost = cost;
                } else {
                    console.log("DEBUG: Invalid house purchase condition for", itemNameFromData);
                    showModal("Invalid Purchase", "You either already own this or a better house, or cannot downgrade.");
                    savings += cost;
                    happiness -= happinessBonus; // Revert transaction
                    happiness = Math.max(0, Math.min(100, happiness)); // Clamp happiness again
                    updateStatsBar(); // Update UI to reflect revert
                    return;
                }
                currentMonthlyBudget.housing = 0;
                minMonthlyCosts.housing = 0;
                if (budgetInputs.housing) {
                    budgetInputs.housing.min = 0;
                    budgetInputs.housing.value = 0;
                    budgetInputs.housing.disabled = true;
                }
                checkAndCompleteQuest('starterHome');
                if (playerOwnsHouse === "medium") checkAndCompleteQuest('mansionOwner');

            } else if (itemType === 'car') {
                console.log("DEBUG: Processing 'car' purchase in handlePurchase.");
                if (carsOwned < maxCars) {
                    carsOwned++;
                    addLog(`Bought a new car (${carsOwned}/${maxCars}) for $${cost.toLocaleString()}. Happiness +${happinessBonus}.`);
                    // Check car related quests
                    const autoEnthusiastQuest = activeQuests.find(q => q.id === 'autoEnthusiast' && !q.completed);
                    if (autoEnthusiastQuest && autoEnthusiastQuest.customCheck && autoEnthusiastQuest.customCheck()) checkAndCompleteQuest('autoEnthusiast');

                    const luxuryFleetQuest = activeQuests.find(q => q.id === 'luxuryFleet' && !q.completed);
                    if (luxuryFleetQuest && luxuryFleetQuest.customCheck && luxuryFleetQuest.customCheck()) checkAndCompleteQuest('luxuryFleet');
                } else {
                    showModal("Max Cars Reached", `You already own the maximum of ${maxCars} cars.`);
                    savings += cost;
                    happiness -= happinessBonus; // Revert
                    happiness = Math.max(0, Math.min(100, happiness)); // Clamp happiness again
                    updateStatsBar();
                    return;
                }
            } else { // This is for general discretionary items (luxury, shoes, etc.)
                console.log(`DEBUG: Processing general discretionary item: "${itemNameFromData}", Type: "${itemType}"`);
                purchasedItemCounts[itemNameFromData] = (purchasedItemCounts[itemNameFromData] || 0) + 1;
                addLog(`Purchased ${itemNameFromData} for $${cost.toLocaleString()}. Happiness +${happinessBonus}.`);
                updateQuestProgress({
                    itemTypeBought: itemType,
                    itemName: itemNameFromData,
                    itemCost: cost
                });

                // Example specific quest check (The Philanthropist for "Fancy Shoes")
                const philQuest = activeQuests.find(q => q.id === 'thePhilanthropist' && !q.completed);
                if (philQuest && itemType === philQuest.itemTypeToTrack && itemNameFromData.includes("Shoes")) {
                    philQuest.progress = (philQuest.progress || 0) + cost;
                    if (philQuest.progress >= philQuest.targetSpecificSpend) checkAndCompleteQuest(philQuest.id);
                }
                console.log(`DEBUG: Discretionary purchase "${itemNameFromData}" complete. Savings: ${savings}, Happiness: ${happiness}`);
            }
            updateStatsBar();
            updateCostDisplaysAndMinValues(); // Primarily for housing, but harmless to call
            updateBudgetDisplays(); // Primarily for housing, but harmless to call
        } else {
            console.log(`DEBUG: Cannot afford "${itemNameFromData}". Savings: ${savings}, Cost: ${cost}`);
            showModal("Can't Afford!", `Need $${cost.toLocaleString()} in savings for ${itemNameFromData}. You have $${savings.toLocaleString()}.`);
        }
    }

    function triggerRandomEvent() {
        console.log("DEBUG: triggerRandomEvent called");
        let baseEvents = [{
                name: "Appliance Failure",
                message: "Your [Appliance] gave out. Repairs: $[Amount].",
                type: "cost",
                minCost: 150,
                maxCost: 700,
                happinessEffect: -8
            },
            {
                name: "Found Money",
                message: "You found $[Amount] in an old jacket!",
                type: "gain",
                minGain: 25,
                maxGain: 100,
                happinessEffect: 1
            },
            {
                name: "Medical Bill",
                message: "Unexpected doctor's visit. Cost: $[Amount].",
                type: "cost",
                minCost: 100,
                maxCost: 400,
                happinessEffect: -7
            },
            {
                name: "Stock Dividend",
                message: "A small investment paid a dividend of $[Amount].",
                type: "gain",
                minGain: 40,
                maxGain: 150,
                happinessEffect: 1,
                condition: () => calculateTotalPortfolioValue() > 1000 && economyState !== "Recession"
            },
            {
                name: "Market Dip Event",
                message: "Your investments took a hit due to market news: Loss $[Amount].",
                type: "cost",
                minCost: 100,
                maxCost: 500,
                happinessEffect: -5,
                condition: () => calculateTotalPortfolioValue() > 500 && economyState === "Recession"
            },
            {
                name: "Lost Wallet",
                message: "Oh no, you lost your wallet! Lost $[Amount].",
                type: "cost",
                minCost: 75,
                maxCost: 200,
                happinessEffect: -9
            },
            {
                name: "Side Gig Opportunity",
                message: "A quick side job earned you an extra $[Amount]!",
                type: "gain",
                minGain: 100,
                maxGain: 400,
                happinessEffect: 2,
                condition: () => age < 45
            },
            {
                name: "Sudden Urgent Travel",
                message: "Urgent family travel. Cost: $[Amount].",
                type: "cost",
                minCost: 300,
                maxCost: 1000,
                happinessEffect: -6
            },
            {
                name: "Identity Theft Scare",
                message: "Identity theft scare! Spent $[Amount] on credit monitoring and fixing issues.",
                type: "cost",
                minCost: 200,
                maxCost: 500,
                happinessEffect: -12
            },
            {
                name: "Friendly Loan Request",
                message: "A friend asked for a loan of $[Amount]. You gave it (unlikely to be repaid).",
                type: "cost",
                minCost: 100,
                maxCost: 300,
                happinessEffect: -3,
                condition: () => savings > 1000
            }
        ];

        let eventPool = [...baseEvents];
        if (happiness < lowHappinessPenaltyThreshold && Math.random() < 0.35) {
            eventPool.push({
                name: "Productivity Crash",
                message: "Your extremely low mood made you miss work/opportunities! Lost $[Amount] income this month.",
                type: "cost",
                minCost: Math.max(50, Math.round(netMonthlyIncome * 0.10)),
                maxCost: Math.max(100, Math.round(netMonthlyIncome * 0.20)),
                happinessEffect: -8
            });
        }
        if (savings > stagnationWealthThreshold * 3 && currentMonthlyBudget.fun < netMonthlyIncome * stagnationLowFunThreshold * 0.5 && Math.random() < 0.2) {
            eventPool.push({
                name: "Unexpected Major Expense",
                message: "A sudden major household repair (or similar large expense) appeared! Cost: $[Amount].",
                type: "cost",
                minCost: Math.max(500, Math.round(savings * 0.05)),
                maxCost: Math.max(1000, Math.round(savings * 0.10)),
                happinessEffect: -10
            });
        }

        if (eventPool.length === 0) {
            console.log("DEBUG: No eligible random events.");
            return;
        }
        let event = eventPool[Math.floor(Math.random() * eventPool.length)];
        let amount = 0;
        let message = event.message;
        console.log("DEBUG: Selected random event:", event.name);

        if (event.type === "cost") {
            amount = Math.floor(Math.random() * (event.maxCost - event.minCost + 1)) + event.minCost;
            amount = Math.max(0, amount);
            message = message.replace("[Amount]", amount.toLocaleString()).replace("[Appliance]", ["Dishwasher", "Oven", "Laptop", "Car Part"][Math.floor(Math.random() * 4)]);
            if (savings >= amount) savings -= amount;
            else {
                debt += (amount - savings);
                savings = 0;
                message += " Had to go into debt.";
                happiness -= 5;
            }
            addLog(`Event: ${event.name}. Cost: $${amount.toLocaleString()}.`);
        } else if (event.type === "gain") {
            amount = Math.floor(Math.random() * (event.maxGain - event.minGain + 1)) + event.minGain;
            amount = Math.max(0, amount);
            message = message.replace("[Amount]", amount.toLocaleString());
            savings += amount;
            addLog(`Event: ${event.name}. Gain: $${amount.toLocaleString()}.`);
        }
        if (event.happinessEffect) happiness += event.happinessEffect;
        showModal(event.name, message);
        updateStatsBar();
    }

    function gameOver(reason) {
        isSimulatingMonth = true;
        if (simMonthButton) simMonthButton.disabled = true;
        console.log(`DEBUG: GAME OVER - ${reason}`);
        if (gameOverTitle) gameOverTitle.textContent = "Game Over";
        if (gameOverMessage) gameOverMessage.innerHTML = `Reason: ${reason}<br>Age: ${age}<br>Net Worth: $${(savings + calculateTotalPortfolioValue() - debt).toLocaleString()}<br>Economy: ${economyState}`;
        selectScreen('game-over-screen');
    }

    function winGame(finalNetWorth) {
        isSimulatingMonth = true;
        if (simMonthButton) simMonthButton.disabled = true;
        console.log("DEBUG: WIN GAME!");
        if (winStatsList) winStatsList.innerHTML = `<li>Final Age: ${age}</li><li>Net Worth: $${finalNetWorth.toLocaleString()}</li><li>Savings: $${savings.toLocaleString()}</li><li>Investments: $${calculateTotalPortfolioValue().toLocaleString()}</li><li>House: ${playerOwnsHouse === "none" ? "None" : playerOwnsHouse.charAt(0).toUpperCase() + playerOwnsHouse.slice(1)}</li><li>Cars: ${carsOwned}</li><li>Annual Income: $${annualIncome.toLocaleString()}</li><li>Happiness: ${Math.round(happiness)}%</li><li>Economy: ${economyState}</li>`;
        selectScreen('win-screen');
    }

    function countPurchasedItems(itemNameSubstringOrExact) {
        let count = 0;
        for (const itemName in purchasedItemCounts) {
            if (itemName.includes(itemNameSubstringOrExact)) {
                count += purchasedItemCounts[itemName];
            }
        }
        return count;
    }

    function checkForStockDouble(multiplier = 2) {
        for (const stockId in portfolio) {
            const holding = portfolio[stockId];
            const stockDef = stockDefinitions[stockId];
            if (holding && stockDef && holding.shares > 0 && (holding.totalBuyCost || 0) > 0) { // Check totalBuyCost > 0
                const currentVal = holding.shares * stockDef.currentPrice;
                if (currentVal >= holding.totalBuyCost * multiplier) {
                    return true;
                }
            }
        }
        return false;
    }

    function checkStockConcentration(targetConcentration) {
        const totalPortfolioVal = calculateTotalPortfolioValue();
        if (totalPortfolioVal < 100) return false;
        for (const stockId in portfolio) {
            const holding = portfolio[stockId];
            const stockDef = stockDefinitions[stockId];
            if (holding && stockDef && holding.shares > 0) {
                const stockValue = holding.shares * stockDef.currentPrice;
                if (stockValue / totalPortfolioVal >= targetConcentration) {
                    return true;
                }
            }
        }
        return false;
    }

    console.log("DEBUG: Script fully parsed. Adding final event listeners if elements exist.");
    if (simMonthButton) simMonthButton.addEventListener('click', simulateMonth);
    else console.error("DEBUG: simMonthButton not found for listener setup.");
    if (discretionaryItemsContainer) {
        discretionaryItemsContainer.addEventListener('click', (e) => {
            console.log("DEBUG: Click detected inside discretionaryItemsContainer. Target:", e.target);
            // Check if the clicked element itself is a discretionary item,
            // and not a major purchase (which have their own container/logic if separated)
            if (e.target.classList.contains('discretionary-item') && !e.target.classList.contains('major-purchase')) {
                console.log("DEBUG: Discretionary item button clicked:", e.target.dataset.itemName || e.target.textContent);
                try {
                    handlePurchase(e.target);
                } catch (error) {
                    console.error("DEBUG: Error in handlePurchase for discretionary item:", error, error.stack);
                    alert("Error processing purchase. Check console.");
                }
            } else {
                // This log helps see if the click is registered but the condition fails
                // console.log("DEBUG: Clicked target is not a qualifying discretionary item button.");
                // if (e.target.classList.contains('discretionary-item')) {
                //     console.log("DEBUG: It HAS 'discretionary-item' class.");
                // }
                // if (e.target.classList.contains('major-purchase')) {
                //     console.log("DEBUG: It HAS 'major-purchase' class, so it's being ignored here.");
                // }
            }
        });
    } else {
        console.error("DEBUG: discretionaryItemsContainer element not found! Discretionary spending will not work.");
    }
    if (majorPurchasesContainer) majorPurchasesContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('major-purchase')) handlePurchase(e.target);
    });
    else console.error("DEBUG: majorPurchasesContainer not found");
    if (restartGameButton) restartGameButton.addEventListener('click', () => {
        selectScreen('start-screen');
        jobOptions.forEach(btn => btn.classList.remove('selected'));
        if (playerNameInput) playerNameInput.value = ""; /* initializeGame(); // Don't auto-init, let player choose job again */
    });
    else console.error("DEBUG: restartGameButton not found");
    if (restartGameWinButton) restartGameWinButton.addEventListener('click', () => {
        selectScreen('start-screen');
        jobOptions.forEach(btn => btn.classList.remove('selected'));
        if (playerNameInput) playerNameInput.value = ""; /* initializeGame(); */
    });
    else console.error("DEBUG: restartGameWinButton not found");

    console.log("DEBUG: All event listeners attempted to be set up.");
    selectScreen('start-screen');
    console.log("DEBUG: Initial screen selected successfully after all listener setups.");
});