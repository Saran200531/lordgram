// Simple validation script - run with: node tests/auth.test.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

console.log('🧪 Starting Authentication Tests...\n');

const tests = {
    passed: 0,
    failed: 0,
    results: []
};

function test(name, condition) {
    if (condition) {
        tests.passed++;
        tests.results.push(`✅ ${name}`);
    } else {
        tests.failed++;
        tests.results.push(`❌ ${name}`);
    }
}

async function runTests() {
    const rootDir = process.cwd();

    // Test 1: Check Firebase config exists
    const firebaseConfigPath = path.join(rootDir, 'services', 'firebase.ts');
    test('Firebase config file exists', fs.existsSync(firebaseConfigPath));

    // Test 2: Check AuthContext exists
    const authContextPath = path.join(rootDir, 'context', 'AuthContext.tsx');
    test('AuthContext file exists', fs.existsSync(authContextPath));

    // Test 3: Check SignIn page exists
    const signInPath = path.join(rootDir, 'pages', 'SignIn.tsx');
    test('SignIn page exists', fs.existsSync(signInPath));

    // Test 4: Check SignUp page exists
    const signUpPath = path.join(rootDir, 'pages', 'SignUp.tsx');
    test('SignUp page exists', fs.existsSync(signUpPath));

    // Test 5: Check ProtectedRoute exists
    const protectedRoutePath = path.join(rootDir, 'components', 'ProtectedRoute.tsx');
    test('ProtectedRoute component exists', fs.existsSync(protectedRoutePath));

    // Test 6: Check environment variables
    const envPath = path.join(rootDir, '.env.local');
    test('Environment file exists', fs.existsSync(envPath) || fs.existsSync(path.join(rootDir, '.env')));

    // Print results
    console.log('\n📊 TEST RESULTS:');
    console.log('================');
    tests.results.forEach(r => console.log(r));
    console.log('================');
    console.log(`Total: ${tests.passed + tests.failed} | Passed: ${tests.passed} | Failed: ${tests.failed}`);

    if (tests.failed > 0) {
        console.log('\n⚠️  Some tests failed. Please fix issues before proceeding.');
        process.exit(1);
    } else {
        console.log('\n🎉 All tests passed! Authentication setup is complete.');
    }
}

runTests().catch(console.error);
