const fs = require('fs');

// Load students data
const students = JSON.parse(fs.readFileSync('students.json', 'utf8'));

// Get today's date in Asia/Kolkata timezone
const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
const [todayYear, todayMonth, todayDay] = today.split('-');

console.log(`Checking birthdays for ${today} (Asia/Kolkata)`);

// Check each student's birthday
students.forEach(student => {
  const [dobYear, dobMonth, dobDay] = student.dob.split('-');
  
  if (dobMonth === todayMonth && dobDay === todayDay) {
    const age = parseInt(todayYear) - parseInt(dobYear);
    console.log(`🎉 BIRTHDAY TODAY: ${student.name} turns ${age}!`);
  }
});