// Initialize Firebase (Add your Firebase configuration here)
const firebaseConfig = {
    apiKey: "AIzaSyCgq16HlkHj2g1CpgzYNj1SGrN3DesJkLs",
    authDomain: "elections-56ff0.firebaseapp.com",
    databaseURL: "https://elections-56ff0-default-rtdb.firebaseio.com",
    projectId: "elections-56ff0",
    storageBucket: "elections-56ff0.appspot.com",
    messagingSenderId: "155968088595",
    appId: "1:155968088595:web:91a355ba6d8d0333522de6",
    measurementId: "G-B29D358EC3"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
// Function to handle voting
document.getElementById('voteButton').addEventListener('click', function() {
    const nameInput = normalizeName(document.getElementById('name').value.toLowerCase());

    // Validate the name
    if (!nameInput) {
        alert('Please enter your name.');
    } else if (enteredNames.includes(nameInput)) {
        alert('You have already voted.');
    } else if (!/^[a-z\s]+$/.test(nameInput)) {
        alert('Name should only contain letters (capitalization ignored) and spaces.');
    } else {
        const selectedCandidate = document.querySelector('.tick-button.selected');
        if (!selectedCandidate) {
            alert('Please select a candidate before voting.');
        } else {
            const candidateName = selectedCandidate.getAttribute('data-candidate');

            // Update the vote count in Firebase (You can replace 'votes' with your database reference)
            const voteRef = database.ref('votes/' + candidateName);
            voteRef.transaction(function(currentVote) {
                return (currentVote || 0) + 1;
            });

            // Save the name along with the candidate in the database
            const voterRef = database.ref('voters/' + nameInput);
            voterRef.set({
                name: nameInput,
                votedFor: candidateName
            });

            // Clear the name input
            document.getElementById('name').value = '';

            // Deselect the selected candidate
            selectedCandidate.classList.remove('selected');

            // Add the entered name to the array to prevent duplicates
            enteredNames.push(nameInput);
        }
    }
});

// Function to handle selecting a candidate
document.querySelectorAll('.tick-button').forEach(function(button) {
    button.addEventListener('click', function() {
        // Toggle the "selected" class
        button.classList.toggle('selected');
    });
});

// Function to trim and normalize input
function normalizeName(input) {
    return input.trim().replace(/\s+/g, ' ');
}

// Initialize an array to store entered names
const enteredNames = [];

// Function to handle the reset button
document.getElementById('resetButton').addEventListener('click', function() {
    // Reset all vote counts to zero (You can replace 'votes' with your database reference)
    const voteRef = database.ref('votes');
    voteRef.set({
        'Adarsh Shrivastava': 0,
        'Ayush Patel': 0,
        'Pragya Tiwari': 0,
        'Saksham Tiwari': 0,
        'Saransh Payas': 0
    });

    // Clear the results
    document.getElementById('voteCount').innerHTML = '';

    // Clear the entered names array
    enteredNames.length = 0;

    // Deselect the selected candidate
    document.querySelectorAll('.tick-button.selected').forEach(function(button) {
        button.classList.remove('selected');
    });

    // Delete all voter names from the database
    const votersRef = database.ref('voters');
    votersRef.remove();

});

// Function to handle showing the results
document.getElementById('showResultsButton').addEventListener('click', function() {
    const password = prompt('Enter the password to view results:');
    if (password === 'Ayan@1230') {
        // Retrieve and display the vote counts if the password is correct
        const voteCountRef = database.ref('votes');
        voteCountRef.once('value', function(snapshot) {
            const voteCount = snapshot.val();
            const voteCountList = document.getElementById('voteCount');
            voteCountList.innerHTML = '';

            for (const candidate in voteCount) {
                const count = voteCount[candidate];
                const listItem = document.createElement('li');
                listItem.innerHTML = `${candidate}: ${count} votes`;
                voteCountList.appendChild(listItem);
            }
        });
    } else {
        alert('Incorrect password. Please try again.');
    }

});
