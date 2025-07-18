import { execa } from 'execa';
import path from 'path';

const outsideDirectory = path.resolve(__dirname, '..', '..', 'create-eth');

async function testProcessExit() {
  console.log(`Executing command in directory: ${outsideDirectory}`);
  console.log('First test:');
  try {
    // Example command that might fail with exit code 1
    // You can replace this with any command you want to test
    const result = await execa('yarn', ['cli', '-e', 'non-existent-extension'], {
      cwd: outsideDirectory,
      reject: false // This prevents execa from throwing on non-zero exit codes
    });
    
    // Check if the process exited with code 1
    if (result.exitCode === 1) {
      console.log('✅ Process exited with exit code 1 as expected');
    } else {
      console.log(`❌ Process exited with code ${result.exitCode}, expected 1`);
      console.log('FAILURE');
    }
    
  } catch (error) {
    console.error('❌ Error executing command:', error);
    
    // If you want to handle the error differently when reject: true
    if (error instanceof Error && 'exitCode' in error) {
      const exitCode = (error as any).exitCode;
      console.log(`Process exited with code: ${exitCode}`);
      
      if (exitCode === 1) {
        console.log('✅ Process exited with exit code 1 as expected');
        console.log('SUCCESS');
      }
    }
  }
}

// Alternative function that throws on non-zero exit codes
async function testProcessExitWithReject() {
  console.log('Second test');
  try {
    // This will throw an error if the command fails
    const result = await execa('yarn', ['cli', '-e', 'non-existent-extension'], {
      cwd: outsideDirectory,
      reject: true
    });
    
    console.log('❌ Command executed without error! That should not happen :/');
    console.log('Exit code:', result.exitCode);
    console.log('FAILURE');
  } catch (error) {
    if (error instanceof Error && 'exitCode' in error) {
      const exitCode = (error as any).exitCode;
      if (exitCode === 1) {
        console.log('✅ Process exited with exit code 1 as expected');
        console.log('SUCCESS');
      }
    }
  }
}

// Run both examples
async function main() {
  console.log('🚀 Testing execa with exit code handling\n');
  
  await testProcessExit();
  await testProcessExitWithReject();
  
  console.log('\n✨ Test completed!');
}

main().catch(console.error); 
