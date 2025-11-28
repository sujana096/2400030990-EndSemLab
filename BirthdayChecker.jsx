import React, { useEffect } from 'react';

const BirthdayChecker = () => {
  useEffect(() => {
    fetch('/check-today')
      .then(res => res.json())
      .then(birthdays => {
        birthdays.forEach(student => {
          alert(`🎉 Birthday Today: ${student.name} turns ${student.age}!`);
        });
      })
      .catch(err => console.error('Error:', err));
  }, []);

  return <div>Birthday checker running...</div>;
};

export default BirthdayChecker;