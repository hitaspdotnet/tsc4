import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, toNano } from 'ton-core';
import { Task5 } from '../wrappers/Task5';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('Task5', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Task5');
    });

    let blockchain: Blockchain;
    let task5: SandboxContract<Task5>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        task5 = blockchain.openContract(Task5.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await task5.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: task5.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and task3 are ready to use
    });

    it('should get Fib dynamic', async () => {
        for (let j = 0; j < 10; j++) {
            for (let x = 0; x > 10; x++) {
                const res = await task5.getfibonacci_sequence(BigInt(j), BigInt(x))
                //  console.log('res', res)

                const result = res.stack.readTuple()

                const fib = getFibSeq(j, x)

                // console.log('result', result)
                // console.log('getFibSeq', fib)

                expect(BigInt(result.remaining)).toEqual(BigInt(x))
                for (let i = 0; i < fib.length; i++) {
                    expect(fib[i].toString()).toEqual(result.readBigNumber().toString())
                }
            }
        }
    });

    it('should get Fib static', async () => {
        const j = 369;
        const x = 1;
        const res = await task5.getfibonacci_sequence(BigInt(j), BigInt(x))
        //  console.log('res', res)

        const result = res.stack.readTuple()

        const fib = getFibSeq(j, x)

        // console.log('result', result)
        // console.log('getFibSeq', fib)

        expect(BigInt(result.remaining)).toEqual(BigInt(x))
        for (let i = 0; i < fib.length; i++) {
            expect(fib[i].toString()).toEqual(result.readBigNumber().toString())
        }
    });
});

function getFibSeq(n: number , k: number) {
    let  numbers = [];

    let n1 = 0n;
    let n2 = 1n;
    let j = (n + k);

    for (let i = 0; i < j; i++){
        if((i - n) >= 0){
            numbers.push(n1);
        }
        if((j - i - 1) > 0){
            let temp = n1;
            n1 = n2;
            if((j - i - 2) > 0) {
                n2 = temp + n2;
            }
        }
    }

    return numbers;
}