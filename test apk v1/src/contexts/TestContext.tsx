import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { Question, ShuffledQuestion, Test, TestCategory, TestAttempt } from "../types";

const SAVED_TEST_STATE_KEY = 'jee_mock_test_saved_state';
const TEST_ATTEMPTS_KEY = 'jee_mock_test_attempts';

const sampleQuestions: Question[] = [

// JEE B.Arch PYQ 2025 April Attempt
{ id: 1, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1nqwR8KC6VO2WdQUZH03T5Jby0roMongI&sz=w2000", optionA: "d", optionB: "c", optionC: "b", optionD: "a", correctOption: "d" },
{ id: 2, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1nv6vQXogWLOlIiulRtK4UflEfuaffW9c&sz=w2000", optionA: "d", optionB: "b", optionC: "c", optionD: "a", correctOption: "d" },
{ id: 3, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1nxxhg4VWTN9lmKbbRSsEUCHO_oaANfNG&sz=w2000", optionA: "c", optionB: "d", optionC: "b", optionD: "a", correctOption: "d" },
{ id: 4, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1nzRza3Y0LDn6j7nMX1xl4SjBIzBlFtZk&sz=w2000", optionA: "a", optionB: "c", optionC: "d", optionD: "b", correctOption: "d" },
{ id: 5, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1o-JTkKfaKe4z-jT4ku6Ji4r5-eGOzm52&sz=w2000", optionA: "b", optionB: "a", optionC: "c", optionD: "d", correctOption: "d" },
{ id: 6, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1o3C4Aboztv6paPy56xKTGYvGohrp4Hmk&sz=w2000", optionA: "c", optionB: "b", optionC: "d", optionD: "a", correctOption: "d" },
{ id: 7, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1o4gkBxB5GhAKnjsrCTaKN0-iP1uql1hn&sz=w2000", optionA: "a", optionB: "b", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 8, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1o8oNDjmWRcim3DEVuKe1R73uPyNVO3uU&sz=w2000", optionA: "b", optionB: "d", optionC: "a", optionD: "c", correctOption: "d" },
{ id: 9, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1o97ZYCf_OLHTmtjBvZDbpEw2JdSqbyqU&sz=w2000", optionA: "b", optionB: "a", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 10, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1oHWnYR0EqcTnndkQ4D4-ro29hpuEF6yV&sz=w2000", optionA: "d", optionB: "a", optionC: "c", optionD: "b", correctOption: "d" },
{ id: 11, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1oP699Fjm2uAZyD__MhQlejWn5zk48bml&sz=w2000", optionA: "c", optionB: "d", optionC: "a", optionD: "b", correctOption: "d" },
{ id: 12, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1oPSF9ZbJ_Qa4yJEeCdlo0cCsuAG4-_P_&sz=w2000", optionA: "a", optionB: "c", optionC: "b", optionD: "d", correctOption: "d" },
{ id: 13, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1oTdCAsbeAfcEjk3X43h0nWof-8i_e8ea&sz=w2000", optionA: "b", optionB: "c", optionC: "d", optionD: "a", correctOption: "d" },
{ id: 14, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1oYlARBq4ddYercqKE7Y3nCghZ79yCh2R&sz=w2000", optionA: "c", optionB: "a", optionC: "b", optionD: "d", correctOption: "d" },
{ id: 15, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1o_C2-HX8zHV5Dc_c4fnt4bZ4fKjPkBt-&sz=w2000", optionA: "a", optionB: "c", optionC: "d", optionD: "b", correctOption: "d" },
{ id: 16, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1oahJnyEerL9HWFjyU4YRj_FRTtRL1sbZ&sz=w2000", optionA: "b", optionB: "c", optionC: "a", optionD: "d", correctOption: "d" },
{ id: 17, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1oc022o9nuT739rTm7PK6tFbL5Lv3UW1O&sz=w2000", optionA: "a", optionB: "c", optionC: "d", optionD: "b", correctOption: "d" },
{ id: 18, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1oi7jOfJGqQQK7b58x50HSZJyNPj1VeMv&sz=w2000", optionA: "d", optionB: "a", optionC: "b", optionD: "c", correctOption: "d" },
{ id: 19, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1onHwHvcSrZzQsZ2NjAneT95ZPKenRP-4&sz=w2000", optionA: "d", optionB: "a", optionC: "c", optionD: "b", correctOption: "d" },
{ id: 20, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1otdEsWhCSD0la91jePMOmMKRsjZGdY49&sz=w2000", optionA: "a", optionB: "d", optionC: "b", optionD: "c", correctOption: "d" },
{ id: 21, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1ou3-HOQ89z6BnXHulhxDGs6V0oSgZfKO&sz=w2000", optionA: "c", optionB: "d", optionC: "a", optionD: "b", correctOption: "d" },
{ id: 22, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1ouvwjWB_YZ6-F5b938THmWt4wutMA8Dd&sz=w2000", optionA: "c", optionB: "b", optionC: "d", optionD: "a", correctOption: "d" },
{ id: 23, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1oyail-YweH2hKoa77TPjGNxNvzF2E9Y-&sz=w2000", optionA: "b", optionB: "d", optionC: "c", optionD: "a", correctOption: "d" },
{ id: 24, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1p3VcWUio3rmQk49Wraj9cKSNfoTfkl9-&sz=w2000", optionA: "b", optionB: "d", optionC: "c", optionD: "a", correctOption: "d" },
{ id: 25, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1pGeOqt4B7wmKBDouegIbF8y05S1pDDr0&sz=w2000", optionA: "a", optionB: "c", optionC: "b", optionD: "d", correctOption: "d" },
{ id: 26, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1pUQHV3dv_LUJaxDsupDI8jkuz382JdFj&sz=w2000", optionA: "c", optionB: "b", optionC: "d", optionD: "a", correctOption: "d" },
{ id: 27, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1pVKWkhunQOiMq6oAusKVqEFxMkReSZdy&sz=w2000", optionA: "a", optionB: "c", optionC: "b", optionD: "d", correctOption: "d" },
{ id: 28, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1pXKQzT5s0aFKcpECMvSYZYguN1Nwhl-x&sz=w2000", optionA: "c", optionB: "b", optionC: "a", optionD: "d", correctOption: "d" },
{ id: 29, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1pXo1nkUxVXgR26-BcFmd34APzCw2lSDY&sz=w2000", optionA: "c", optionB: "a", optionC: "d", optionD: "b", correctOption: "d" },
{ id: 30, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1peKsqUDiTvl5rxx8_of6ls0KtLZgtNZJ&sz=w2000", optionA: "a", optionB: "b", optionC: "c", optionD: "d", correctOption: "d" },
{ id: 31, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1pes36ciHNjb8ambJVLyPU6ZoAj5T8rnb&sz=w2000", optionA: "b", optionB: "d", optionC: "c", optionD: "a", correctOption: "d" },
{ id: 32, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1pm-QHJXRQnypEiLrU_ZlVcT8avSyI4-1&sz=w2000", optionA: "d", optionB: "a", optionC: "b", optionD: "c", correctOption: "d" },
{ id: 33, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1pvlATMjW2RVAbJJktBU-bYqVEIwMGgfJ&sz=w2000", optionA: "b", optionB: "a", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 34, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1px8DfxlQnggcIfm2-K_bxynM04_7URZl&sz=w2000", optionA: "b", optionB: "c", optionC: "d", optionD: "a", correctOption: "d" },
{ id: 35, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1pyFpJJfc67Hj78QHJGvELs6EtzjbOzLF&sz=w2000", optionA: "a", optionB: "b", optionC: "c", optionD: "d", correctOption: "d" },
{ id: 36, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1q--Dw79tgHDBFIVLdQ6eRXgQMvcLamnG&sz=w2000", optionA: "a", optionB: "c", optionC: "d", optionD: "b", correctOption: "d" },
{ id: 37, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1q2GMwNMYY9ZLHP8UHmZa0X_JtuAk68qe&sz=w2000", optionA: "c", optionB: "b", optionC: "d", optionD: "a", correctOption: "d" },
{ id: 38, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1qBXoSw9dWHDQyxeHAU7iHX2Sk6fMv1cm&sz=w2000", optionA: "b", optionB: "a", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 39, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1qCOeHUNfAT_isj5IW18R_OxIUeOesytE&sz=w2000", optionA: "b", optionB: "c", optionC: "a", optionD: "d", correctOption: "d" },
{ id: 40, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1qJsB7mjQxZxErd3-YaSTwPEhradtfhMv&sz=w2000", optionA: "b", optionB: "d", optionC: "a", optionD: "c", correctOption: "d" },
{ id: 41, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1qWiHdnLsWGGKdh9zMy2SoSMQmhi11fRJ&sz=w2000", optionA: "b", optionB: "a", optionC: "c", optionD: "d", correctOption: "d" },
{ id: 42, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1qXeYmu75J9tbn6ZzQrNY5BQ2w91xX085&sz=w2000", optionA: "b", optionB: "a", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 43, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1qZ6ZJENWWfRTUYsvkEA8wJiLhtXkXHty&sz=w2000", optionA: "b", optionB: "a", optionC: "c", optionD: "d", correctOption: "d" },
{ id: 44, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1qleWJBoVkk4fupcrjAgVJAk3LYuPX8Q_&sz=w2000", optionA: "b", optionB: "d", optionC: "c", optionD: "a", correctOption: "d" },
{ id: 45, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1qp3282dSKw03-o3EYO05uhxh5hCkSVX0&sz=w2000", optionA: "c", optionB: "a", optionC: "d", optionD: "b", correctOption: "d" },
{ id: 46, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1qp4j3RPF-NQmO9siVf8YDV7LXWhyAUbN&sz=w2000", optionA: "b", optionB: "c", optionC: "a", optionD: "d", correctOption: "d" },
{ id: 47, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1qrce24dYt3HlSqjGnRWbBGZLnLKgPc8C&sz=w2000", optionA: "c", optionB: "d", optionC: "b", optionD: "a", correctOption: "d" },
{ id: 48, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1qtUAFt7ZRQTKlwJsFCW0esRorYblZ5Yy&sz=w2000", optionA: "c", optionB: "a", optionC: "b", optionD: "d", correctOption: "d" },
{ id: 49, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1qtbOC6kN5ZVbnwI3Wo_BMthYgzats4j2&sz=w2000", optionA: "c", optionB: "b", optionC: "d", optionD: "a", correctOption: "d" },
{ id: 50, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1qxuTec8eNTT0xZ3nC5jpbv86TYP3Br6a&sz=w2000", optionA: "a", optionB: "b", optionC: "d", optionD: "c", correctOption: "d" },
 ];

const DEFAULT_TEST_DURATION = 3600;

export const testCategories: TestCategory[] = [
  {
    id: "white",
    name: "White Mock Tests",
    icon: "⚪",
    color: "bg-white border-gray-300",
    description: "Comprehensive mock tests",
  },
  {
    id: "blue",
    name: "Blue Mock Tests",
    icon: "🔵",
    color: "bg-blue-50 border-blue-300",
    description: "Advanced practice tests",
  },
  {
    id: "grey",
    name: "Grey Mock Tests",
    icon: "⚫",
    color: "bg-gray-50 border-gray-300",
    description: "Standard difficulty tests",
  },
  {
    id: "pyq",
    name: "PYQ (2005-2025)",
    icon: "📚",
    color: "bg-yellow-50 border-yellow-300",
    description: "Previous Year Questions",
  },
  {
    id: "latest",
    name: "Latest Pattern",
    icon: "🆕",
    color: "bg-green-50 border-green-300",
    description: "New test pattern",
  },
];

const initialTests: Test[] = [
{ id: 'White Mock Test 1', name: 'White Mock Test 1', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(0, 50), category: 'white' },
{ id: 'White Mock Test 2', name: 'White Mock Test 2', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(50, 100), category: 'white' },
{ id: 'White Mock Test 3', name: 'White Mock Test 3', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(100, 150), category: 'white' },
{ id: 'White Mock Test 4', name: 'White Mock Test 4', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(150, 200), category: 'white' },
{ id: 'White Mock Test 5', name: 'White Mock Test 5', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(200, 250), category: 'white' },
{ id: 'White Mock Test 6', name: 'White Mock Test 6', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(250, 300), category: 'white' },
{ id: 'White Mock Test 7', name: 'White Mock Test 7', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(300, 350), category: 'white' },
{ id: 'White Mock Test 8', name: 'White Mock Test 8', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(350, 400), category: 'white' },
{ id: 'Blue Mock Test 1', name: 'Blue Mock Test 1', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(400, 450), category: 'blue' },
{ id: 'Blue Mock Test 2', name: 'Blue Mock Test 2', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(450, 500), category: 'blue' },
{ id: 'Blue Mock Test 3', name: 'Blue Mock Test 3', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(500, 550), category: 'blue' },
{ id: 'Blue Mock Test 4', name: 'Blue Mock Test 4', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(550, 600), category: 'blue' },
{ id: 'Blue Mock Test 5', name: 'Blue Mock Test 5', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(600, 650), category: 'blue' },
{ id: 'Blue Mock Test 6', name: 'Blue Mock Test 6', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(650, 700), category: 'blue' },
{ id: 'Blue Mock Test 7', name: 'Blue Mock Test 7', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(700, 750), category: 'blue' },
{ id: 'Blue Mock Test 8', name: 'Blue Mock Test 8', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(750, 800), category: 'blue' },
{ id: 'Blue Mock Test 9', name: 'Blue Mock Test 9', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(800, 850), category: 'blue' },
{ id: 'Blue Mock Test 10', name: 'Blue Mock Test 10', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(850, 900), category: 'blue' },
{ id: 'Grey Mock Test 1', name: 'Grey Mock Test 1', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(900, 950), category: 'grey' },
{ id: 'Grey Mock Test 2', name: 'Grey Mock Test 2', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(950, 1000), category: 'grey' },
{ id: 'Grey Mock Test 3', name: 'Grey Mock Test 3', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(1000, 1050), category: 'grey' },
{ id: 'Grey Mock Test 5', name: 'Grey Mock Test 5', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(1050, 1100), category: 'grey' },
{ id: 'Grey Mock Test 6', name: 'Grey Mock Test 6', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(1100, 1150), category: 'grey' },
{ id: 'Grey Mock Test 7', name: 'Grey Mock Test 7', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(1150, 1200), category: 'grey' },
{ id: 'Grey Mock Test 8', name: 'Grey Mock Test 8', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(1200, 1250), category: 'grey' },
{ id: 'Grey Mock Test 9', name: 'Grey Mock Test 9', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(1250, 1300), category: 'grey' },
{ id: 'Grey Mock Test 10', name: 'Grey Mock Test 10', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(1300, 1350), category: 'grey' },
{ id: 'Grey Mock Test 11', name: 'Grey Mock Test 11', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(1350, 1400), category: 'grey' },
{ id: 'Grey Mock Test 12', name: 'Grey Mock Test 12', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(1400, 1450), category: 'grey' },
{ id: 'Grey Mock Test 13', name: 'Grey Mock Test 13', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(1450, 1500), category: 'grey' },
{ id: 'Grey Mock Test 14', name: 'Grey Mock Test 14', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(1500, 1550), category: 'grey' },
{ id: 'Grey Mock Test 15', name: 'Grey Mock Test 15', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(1550, 1600), category: 'grey' },
{ id: 'Grey Mock Test 16', name: 'Grey Mock Test 16', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(1600, 1650), category: 'grey' },
{ id: 'Grey Mock Test 17', name: 'Grey Mock Test 17', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(1650, 1700), category: 'grey' },
{ id: 'Grey Mock Test 18', name: 'Grey Mock Test 18', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(1700, 1750), category: 'grey' },
{ id: 'Grey Mock Test 19', name: 'Grey Mock Test 19', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(1750, 1800), category: 'grey' },
{ id: 'Grey Mock Test 20', name: 'Grey Mock Test 20', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(1800, 1850), category: 'grey' },
{ id: 'Grey Mock Test 21', name: 'Grey Mock Test 21', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(1850, 1900), category: 'grey' },
{ id: 'Grey Mock Test 21.5', name: 'Grey Mock Test 21.5', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(1900, 1950), category: 'grey' },
{ id: 'Grey Mock Test 22', name: 'Grey Mock Test 22', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(1950, 2000), category: 'grey' },
{ id: 'Grey Mock Test 23', name: 'Grey Mock Test 23', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(2000, 2050), category: 'grey' },
{ id: 'Grey Mock Test 24', name: 'Grey Mock Test 24', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(2050, 2100), category: 'grey' },
{ id: 'Grey Mock Test 4', name: 'Grey Mock Test 4', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(2100, 2150), category: 'grey' },
{ id: 'Grey Mock Test 26', name: 'Grey Mock Test 26', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(2150, 2200), category: 'grey' },
{ id: 'Grey Mock Test 27', name: 'Grey Mock Test 27', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(2200, 2250), category: 'grey' },
{ id: 'Grey Mock Test 28', name: 'Grey Mock Test 28', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(2250, 2300), category: 'grey' },
{ id: 'Grey Mock Test 29', name: 'Grey Mock Test 29', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(2300, 2350), category: 'grey' },
{ id: 'Grey Mock Test 30', name: 'Grey Mock Test 30', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(2350, 2400), category: 'grey' },
{ id: 'Grey Mock Test 31', name: 'Grey Mock Test 31', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(2400, 2450), category: 'grey' },
{ id: 'Grey Mock Test 32', name: 'Grey Mock Test 32', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(2450, 2500), category: 'grey' },
{ id: 'Grey Mock Test 33', name: 'Grey Mock Test 33', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(2500, 2550), category: 'grey' },
{ id: 'Grey Mock Test 25', name: 'Grey Mock Test 25', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(2550, 2600), category: 'grey' },
{ id: 'JEE B.Arch PYQ 2005', name: 'JEE B.Arch PYQ 2005', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(2600, 2650), category: 'pyq' },
{ id: 'JEE B.Arch PYQ 2006', name: 'JEE B.Arch PYQ 2006', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(2650, 2700), category: 'pyq' },
{ id: 'JEE B.Arch PYQ 2007', name: 'JEE B.Arch PYQ 2007', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(2700, 2750), category: 'pyq' },
{ id: 'JEE B.Arch PYQ 2008', name: 'JEE B.Arch PYQ 2008', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(2750, 2800), category: 'pyq' },
{ id: 'JEE B.Arch PYQ 2009', name: 'JEE B.Arch PYQ 2009', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(2800, 2850), category: 'pyq' },
{ id: 'JEE B.Arch PYQ 2010', name: 'JEE B.Arch PYQ 2010', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(2850, 2900), category: 'pyq' },
{ id: 'JEE B.Arch PYQ 2011', name: 'JEE B.Arch PYQ 2011', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(2900, 2950), category: 'pyq' },
{ id: 'JEE B.Arch PYQ 2012', name: 'JEE B.Arch PYQ 2012', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(2950, 3000), category: 'pyq' },
{ id: 'JEE B.Arch PYQ 2013', name: 'JEE B.Arch PYQ 2013', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(3000, 3050), category: 'pyq' },
{ id: 'JEE B.Arch PYQ 2014', name: 'JEE B.Arch PYQ 2014', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(3050, 3100), category: 'pyq' },
{ id: 'JEE B.Arch PYQ 2015', name: 'JEE B.Arch PYQ 2015', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(3100, 3150), category: 'pyq' },
{ id: 'JEE B.Arch PYQ 2016', name: 'JEE B.Arch PYQ 2016', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(3150, 3200), category: 'pyq' },
{ id: 'JEE B.Arch PYQ 2017', name: 'JEE B.Arch PYQ 2017', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(3200, 3250), category: 'pyq' },
{ id: 'JEE B.Arch PYQ 2018', name: 'JEE B.Arch PYQ 2018', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(3250, 3300), category: 'pyq' },
{ id: 'JEE B.Arch PYQ 2019 January Attempt', name: 'JEE B.Arch PYQ 2019 January Attempt', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(3300, 3350), category: 'pyq' },
{ id: 'JEE B.Arch PYQ 2019 April Attempt Morning', name: 'JEE B.Arch PYQ 2019 April Attempt Morning', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(3350, 3400), category: 'pyq' },
{ id: 'JEE B.Arch PYQ 2019 April Attempt Evening', name: 'JEE B.Arch PYQ 2019 April Attempt Evening', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(3400, 3450), category: 'pyq' },
{ id: 'JEE B.Arch PYQ 2020 January Attempt', name: 'JEE B.Arch PYQ 2020 January Attempt', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(3450, 3500), category: 'pyq' },
{ id: 'JEE B.Arch PYQ 2020 April Attempt Morning', name: 'JEE B.Arch PYQ 2020 April Attempt Morning', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(3500, 3550), category: 'pyq' },
{ id: 'JEE B.Arch PYQ 2020 April Attempt Evening', name: 'JEE B.Arch PYQ 2020 April Attempt Evening', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(3550, 3600), category: 'pyq' },
{ id: 'JEE B.Arch PYQ 2021 January Attempt', name: 'JEE B.Arch PYQ 2021 January Attempt', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(3600, 3650), category: 'pyq' },
{ id: 'JEE B.Arch PYQ 2021 September Attempt Morning', name: 'JEE B.Arch PYQ 2021 September Attempt Morning', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(3650, 3700), category: 'pyq' },
{ id: 'JEE B.Arch PYQ 2021 September Attempt Evening', name: 'JEE B.Arch PYQ 2021 September Attempt Evening', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(3700, 3750), category: 'pyq' },
{ id: 'JEE B.Arch PYQ 2022 June Attempt Morning', name: 'JEE B.Arch PYQ 2022 June Attempt Morning', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(3750, 3800), category: 'pyq' },
{ id: 'JEE B.Arch PYQ 2022 June Attempt Evening', name: 'JEE B.Arch PYQ 2022 June Attempt Evening', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(3800, 3850), category: 'pyq' },
{ id: 'JEE B.Arch PYQ 2022 July Attempt', name: 'JEE B.Arch PYQ 2022 July Attempt', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(3850, 3900), category: 'pyq' },
{ id: 'JEE B.Arch PYQ 2023 January Attempt', name: 'JEE B.Arch PYQ 2023 January Attempt', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(3900, 3950), category: 'pyq' },
{ id: 'JEE B.Arch PYQ 2023 April Attempt', name: 'JEE B.Arch PYQ 2023 April Attempt', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(3950, 4000), category: 'pyq' },
{ id: 'JEE B.Arch PYQ 2024 January Attempt', name: 'JEE B.Arch PYQ 2024 January Attempt', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(4000, 4050), category: 'pyq' },
{ id: 'JEE B.Arch PYQ 2024 April Attempt', name: 'JEE B.Arch PYQ 2024 April Attempt', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(4050, 4100), category: 'pyq' },
{ id: 'JEE B.Arch PYQ 2025 January Attempt', name: 'JEE B.Arch PYQ 2025 January Attempt', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(4100, 4150), category: 'pyq' },
{ id: 'JEE B.Arch PYQ 2025 April Attempt', name: 'JEE B.Arch PYQ 2025 April Attempt', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(4150, 4200), category: 'pyq' }


 ];

export function shuffleOptions(question: Question): ShuffledQuestion {
  const options = [
    { text: question.optionA, originalKey: "a" },
    { text: question.optionB, originalKey: "b" },
    { text: question.optionC, originalKey: "c" },
    { text: question.optionD, originalKey: "d" },
  ];
  const shuffled = [...options];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const correctIndex = shuffled.findIndex(
    (opt) => opt.originalKey === question.correctOption,
  );
  return {
    ...question,
    shuffledOptions: shuffled,
    correctIndex,
  };
}

interface SavedTestState {
  testId: string;
  userEmail: string;
  answers: Record<number, number>;
  markedForReview: Record<number, boolean>;
  visitedQuestions: number[];
  currentQuestion: number;
  timeLeft: number;
  shuffledQuestions: ShuffledQuestion[];
  violations: string[];
  tabSwitchCount: number;
  savedAt: number;
}

interface TestContextType {
  tests: Test[];
  selectedTest: Test | null;
  testStarted: boolean;
  questions: ShuffledQuestion[];
  currentQuestion: number;
  answers: Record<number, number>;
  markedForReview: Record<number, boolean>;
  visitedQuestions: Set<number>;
  timeLeft: number;
  testCompleted: boolean;
  showResults: boolean;
  violations: string[];
  tabSwitchCount: number;
  fullscreenExitCount: number;
  isFullscreen: boolean;
  screenshotBlocked: boolean;
  hasSavedState: boolean;
  savedStateInfo: { testName: string; timeLeft: number; savedAt: Date } | null;
  setTests: React.Dispatch<React.SetStateAction<Test[]>>;
  setSelectedTest: React.Dispatch<React.SetStateAction<Test | null>>;
  selectTest: (test: Test) => void;
  startTest: () => boolean;
  resumeTest: () => boolean;
  clearSavedState: () => void;
  setCurrentQuestion: React.Dispatch<React.SetStateAction<number>>;
  handleAnswer: (questionId: number, answerIndex: number) => void;
  clearResponse: () => void;
  handleSaveAndNext: () => void;
  handleMarkAndNext: () => void;
  handleSubmit: () => void;
  restartTest: () => void;
  handleQuestionNavigation: (idx: number) => void;
  addViolation: (message: string) => void;
  setTabSwitchCount: React.Dispatch<React.SetStateAction<number>>;
  setFullscreenExitCount: React.Dispatch<React.SetStateAction<number>>;
  setIsFullscreen: React.Dispatch<React.SetStateAction<boolean>>;
  setTestCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  setShowResults: React.Dispatch<React.SetStateAction<boolean>>;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  setScreenshotBlocked: React.Dispatch<React.SetStateAction<boolean>>;
  getStatusCounts: () => {
    answered: number;
    visitedNotAnswered: number;
    notVisited: number;
    markedForReviewCount: number;
    answeredMarked: number;
  };
  calculateScore: () => {
    correct: number;
    incorrect: number;
    unattempted: number;
    totalMarks: number;
    maxMarks: number;
  };
  addTest: (
    name: string,
    description: string,
    duration: number,
  ) => { success: boolean; message: string };
  deleteTest: (testId: string) => void;
  testAttempts: TestAttempt[];
  getStudentAttempts: (studentEmail: string) => TestAttempt[];
  getAllAttempts: () => TestAttempt[];
  saveTestAttempt: (studentEmail: string) => void;
}

const TestContext = createContext<TestContextType | undefined>(undefined);

export function TestProvider({ children }: { children: ReactNode }) {
  const [tests, setTests] = useState<Test[]>(initialTests);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [testStarted, setTestStarted] = useState(false);
  const [questions, setQuestions] = useState<ShuffledQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [markedForReview, setMarkedForReview] = useState<
    Record<number, boolean>
  >({});
  const [visitedQuestions, setVisitedQuestions] = useState<Set<number>>(
    new Set([0]),
  );
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TEST_DURATION);
  const [testCompleted, setTestCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [violations, setViolations] = useState<string[]>([]);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [fullscreenExitCount, setFullscreenExitCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [screenshotBlocked, setScreenshotBlocked] = useState(false);
  const [savedStateData, setSavedStateData] = useState<SavedTestState | null>(null);
  const [testAttempts, setTestAttempts] = useState<TestAttempt[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(TEST_ATTEMPTS_KEY);
      if (saved) {
        setTestAttempts(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error loading test attempts:', e);
    }
  }, []);

  const saveTestAttempt = useCallback((studentEmail: string) => {
    if (!selectedTest || questions.length === 0) return;
    
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;
    questions.forEach((q) => {
      if (answers[q.id] !== undefined) {
        if (answers[q.id] === q.correctIndex) {
          correct++;
        } else {
          incorrect++;
        }
      } else {
        unattempted++;
      }
    });
    const totalMarks = correct * 4 - incorrect * 1;
    const timeTaken = selectedTest.duration - timeLeft;

    const attempt: TestAttempt = {
      id: 'attempt_' + Date.now(),
      studentEmail,
      testId: selectedTest.id,
      testName: selectedTest.name,
      score: totalMarks,
      totalQuestions: questions.length,
      correctAnswers: correct,
      wrongAnswers: incorrect,
      unattempted,
      timeTaken,
      totalTime: selectedTest.duration,
      violations,
      tabSwitchCount,
      submittedAt: Date.now()
    };

    setTestAttempts(prev => {
      const updated = [...prev, attempt];
      try {
        localStorage.setItem(TEST_ATTEMPTS_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Error saving test attempt:', e);
      }
      return updated;
    });
  }, [selectedTest, questions, answers, timeLeft, violations, tabSwitchCount]);

  const getStudentAttempts = useCallback((studentEmail: string): TestAttempt[] => {
    return testAttempts.filter(a => a.studentEmail === studentEmail).sort((a, b) => b.submittedAt - a.submittedAt);
  }, [testAttempts]);

  const getAllAttempts = useCallback((): TestAttempt[] => {
    return [...testAttempts].sort((a, b) => b.submittedAt - a.submittedAt);
  }, [testAttempts]);

  const loadSavedState = useCallback(() => {
    try {
      const saved = localStorage.getItem(SAVED_TEST_STATE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as SavedTestState;
        const oneHourAgo = Date.now() - (60 * 60 * 1000);
        if (parsed.savedAt > oneHourAgo && parsed.timeLeft > 0) {
          setSavedStateData(parsed);
          return;
        } else {
          localStorage.removeItem(SAVED_TEST_STATE_KEY);
        }
      }
    } catch (e) {
      console.error('Error reading saved test state:', e);
    }
    setSavedStateData(null);
  }, []);

  useEffect(() => {
    loadSavedState();
  }, [loadSavedState]);

  const savedTest = savedStateData ? tests.find(t => t.id === savedStateData.testId) : null;

  const hasSavedState = !!savedStateData && !!savedTest && !testStarted;
  const savedStateInfo = savedStateData && savedTest && !testStarted ? {
    testName: savedTest.name,
    timeLeft: savedStateData.timeLeft,
    savedAt: new Date(savedStateData.savedAt)
  } : null;

  const saveTestState = useCallback(() => {
    if (testStarted && !testCompleted && selectedTest && questions.length > 0) {
      const stateToSave: SavedTestState = {
        testId: selectedTest.id,
        userEmail: '',
        answers,
        markedForReview,
        visitedQuestions: Array.from(visitedQuestions),
        currentQuestion,
        timeLeft,
        shuffledQuestions: questions,
        violations,
        tabSwitchCount,
        savedAt: Date.now()
      };
      try {
        localStorage.setItem(SAVED_TEST_STATE_KEY, JSON.stringify(stateToSave));
      } catch (e) {
        console.error('Error saving test state:', e);
      }
    }
  }, [testStarted, testCompleted, selectedTest, questions, answers, markedForReview, visitedQuestions, currentQuestion, timeLeft, violations, tabSwitchCount]);

  const clearSavedState = useCallback(() => {
    try {
      localStorage.removeItem(SAVED_TEST_STATE_KEY);
      setSavedStateData(null);
    } catch (e) {
      console.error('Error clearing saved state:', e);
    }
  }, []);

  useEffect(() => {
    if (testStarted && !testCompleted) {
      const interval = setInterval(saveTestState, 5000);
      return () => clearInterval(interval);
    }
  }, [testStarted, testCompleted, saveTestState]);

  useEffect(() => {
    if (testStarted && !testCompleted) {
      saveTestState();
    }
  }, [answers, markedForReview, currentQuestion, saveTestState, testStarted, testCompleted]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (testStarted && !testCompleted) {
        saveTestState();
      }
    };
    const handleVisibilityChange = () => {
      if (document.hidden && testStarted && !testCompleted) {
        saveTestState();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [testStarted, testCompleted, saveTestState]);

  const addViolation = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setViolations((prev) => [...prev, `${timestamp}: ${message}`]);
  };

  const selectTest = (test: Test) => {
    setSelectedTest(test);
    setTimeLeft(test.duration);
    setQuestions([]);
    setCurrentQuestion(0);
    setAnswers({});
    setMarkedForReview({});
    setVisitedQuestions(new Set([0]));
    setTestCompleted(false);
    setShowResults(false);
    setViolations([]);
    setTabSwitchCount(0);
    setFullscreenExitCount(0);
    setScreenshotBlocked(false);
    setTestStarted(false);
  };

  const startTest = (): boolean => {
    if (
      selectedTest &&
      selectedTest.questions &&
      selectedTest.questions.length > 0
    ) {
      try {
        clearSavedState();
        setSavedStateData(null);
        const shuffled = selectedTest.questions.map((q) => shuffleOptions(q));
        setQuestions(shuffled);
        setTestStarted(true);
        setCurrentQuestion(0);
        setAnswers({});
        setMarkedForReview({});
        setVisitedQuestions(new Set([0]));
        setTimeLeft(selectedTest.duration);
        setTestCompleted(false);
        setShowResults(false);
        setViolations([]);
        setTabSwitchCount(0);
        setFullscreenExitCount(0);
        setScreenshotBlocked(false);
        return true;
      } catch (error) {
        console.error("Error starting test:", error);
        return false;
      }
    }
    return false;
  };

  const resumeTest = (): boolean => {
    if (!savedStateData) return false;
    
    const test = tests.find(t => t.id === savedStateData.testId);
    if (!test) return false;
    
    try {
      setSelectedTest(test);
      setQuestions(savedStateData.shuffledQuestions);
      setAnswers(savedStateData.answers);
      setMarkedForReview(savedStateData.markedForReview);
      setVisitedQuestions(new Set(savedStateData.visitedQuestions));
      setCurrentQuestion(savedStateData.currentQuestion);
      setTimeLeft(savedStateData.timeLeft);
      setViolations(savedStateData.violations || []);
      setTabSwitchCount(savedStateData.tabSwitchCount || 0);
      setTestStarted(true);
      setTestCompleted(false);
      setShowResults(false);
      setFullscreenExitCount(0);
      setScreenshotBlocked(false);
      setSavedStateData(null);
      return true;
    } catch (error) {
      console.error("Error resuming test:", error);
      clearSavedState();
      return false;
    }
  };

  const handleAnswer = (questionId: number, answerIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerIndex }));
  };

  const clearResponse = () => {
    const qId = questions[currentQuestion]?.id;
    if (qId !== undefined) {
      setAnswers((prev) => {
        const newAnswers = { ...prev };
        delete newAnswers[qId];
        return newAnswers;
      });
    }
  };

  const handleSaveAndNext = () => {
    if (currentQuestion < questions.length - 1) {
      const nextQuestion = currentQuestion + 1;
      setCurrentQuestion(nextQuestion);
      setVisitedQuestions((prev) => new Set(prev).add(nextQuestion));
    }
  };

  const handleMarkAndNext = () => {
    const qId = questions[currentQuestion]?.id;
    if (qId !== undefined) {
      setMarkedForReview((prev) => ({ ...prev, [qId]: true }));
      if (currentQuestion < questions.length - 1) {
        const nextQuestion = currentQuestion + 1;
        setCurrentQuestion(nextQuestion);
        setVisitedQuestions((prev) => new Set(prev).add(nextQuestion));
      }
    }
  };

  const handleSubmit = () => {
    const unansweredCount = questions.length - Object.keys(answers).length;
    let confirmMessage = "Are you sure you want to submit the test?";
    if (unansweredCount > 0) {
      confirmMessage = `You have ${unansweredCount} unanswered question(s). Are you sure you want to submit?`;
    }
    const confirmed = window.confirm(confirmMessage);
    if (confirmed) {
      clearSavedState();
      setTestCompleted(true);
      setShowResults(true);
    }
  };

  const restartTest = () => {
    setTestStarted(false);
    setSelectedTest(null);
    setQuestions([]);
    setCurrentQuestion(0);
    setAnswers({});
    setMarkedForReview({});
    setVisitedQuestions(new Set([0]));
    setTimeLeft(DEFAULT_TEST_DURATION);
    setTestCompleted(false);
    setShowResults(false);
    setViolations([]);
    setTabSwitchCount(0);
    setFullscreenExitCount(0);
    setScreenshotBlocked(false);
  };

  const handleQuestionNavigation = (idx: number) => {
    setCurrentQuestion(idx);
    setVisitedQuestions((prev) => new Set(prev).add(idx));
  };

  const getStatusCounts = () => {
    let answered = 0;
    let visitedNotAnswered = 0;
    let notVisited = 0;
    let markedForReviewCount = 0;
    let answeredMarked = 0;
    questions.forEach((q, idx) => {
      const isAnswered = answers[q.id] !== undefined;
      const isMarked = markedForReview[q.id];
      const isVisited = visitedQuestions.has(idx);
      if (isAnswered && isMarked) {
        answeredMarked++;
      } else if (isAnswered) {
        answered++;
      } else if (isMarked) {
        markedForReviewCount++;
      } else if (isVisited) {
        visitedNotAnswered++;
      } else {
        notVisited++;
      }
    });
    return {
      answered,
      visitedNotAnswered,
      notVisited,
      markedForReviewCount,
      answeredMarked,
    };
  };

  const calculateScore = () => {
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;
    questions.forEach((q) => {
      if (answers[q.id] !== undefined) {
        if (answers[q.id] === q.correctIndex) {
          correct++;
        } else {
          incorrect++;
        }
      } else {
        unattempted++;
      }
    });
    const totalMarks = correct * 4 - incorrect * 1;
    const maxMarks = questions.length * 4;
    return { correct, incorrect, unattempted, totalMarks, maxMarks };
  };

  const addTest = (
    name: string,
    description: string,
    duration: number,
  ): { success: boolean; message: string } => {
    if (!name.trim()) {
      return { success: false, message: "Please enter test name" };
    }
    if (isNaN(duration) || duration <= 0) {
      return { success: false, message: "Please enter a valid duration" };
    }
    const newTest: Test = {
      id: "test" + Date.now(),
      name: name.trim(),
      description: description.trim() || "No description",
      duration: duration * 60,
      questions: sampleQuestions,
    };
    setTests((prev) => [...prev, newTest]);
    return {
      success: true,
      message: `Test "${newTest.name}" added successfully!`,
    };
  };

  const deleteTest = (testId: string) => {
    setTests((prev) => prev.filter((t) => t.id !== testId));
  };

  return (
    <TestContext.Provider
      value={{
        tests,
        selectedTest,
        testStarted,
        questions,
        currentQuestion,
        answers,
        markedForReview,
        visitedQuestions,
        timeLeft,
        testCompleted,
        showResults,
        violations,
        tabSwitchCount,
        fullscreenExitCount,
        isFullscreen,
        screenshotBlocked,
        hasSavedState,
        savedStateInfo,
        setTests,
        setSelectedTest,
        selectTest,
        startTest,
        resumeTest,
        clearSavedState,
        setCurrentQuestion,
        handleAnswer,
        clearResponse,
        handleSaveAndNext,
        handleMarkAndNext,
        handleSubmit,
        restartTest,
        handleQuestionNavigation,
        addViolation,
        setTabSwitchCount,
        setFullscreenExitCount,
        setIsFullscreen,
        setTestCompleted,
        setShowResults,
        setTimeLeft,
        setScreenshotBlocked,
        getStatusCounts,
        calculateScore,
        addTest,
        deleteTest,
        testAttempts,
        getStudentAttempts,
        getAllAttempts,
        saveTestAttempt,
      }}
    >
      {children}
    </TestContext.Provider>
  );
}

export function useTest() {
  const context = useContext(TestContext);
  if (context === undefined) {
    throw new Error("useTest must be used within a TestProvider");
  }
  return context;
}

export { DEFAULT_TEST_DURATION };
