import React, { useState } from 'react';

const students = [
  {
    id: 1, // 고유 key가 될 id값
    name : "Inje",
  },
  {
    id: 2,
    name : "Steve",
  },
  {
    id: 3,
    name : "Bill",
  },
  {
    id: 4,
    name : "Jeff",
  },
]

const AttendanceBook = () => {
  return (
    <div>
      {students.map((student) => {
        return <li key={student.id}>{student.name}</li>
      })}
    </div>
  );
};

export default AttendanceBook;