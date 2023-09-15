console.log('build start')
import {execa} from 'execa';


const { stdout } = await execa('echo', ['unicorns', 'hello ', 'world']).pipeStdout('stdout.txt');
console.log(stdout);
