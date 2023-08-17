import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import {beginCell, Cell, toNano} from 'ton-core';
import { Task4 } from '../wrappers/Task4';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('Task4', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Task4');
    });

    let blockchain: Blockchain;
    let task4: SandboxContract<Task4>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        task4 = blockchain.openContract(Task4.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await task4.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: task4.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and task3 are ready to use
    });

    it('aaaaaa', async () => {
        let result = await task4.getEncrypt(0, "abc");
        // result.LoadStringTall.slice(4);
        expect(result).toEqualCell(
            beginCell().storeUint(0, 32).storeStringTail("abc").endCell()
        );
    });
    it('decrypts', async () => {
        expect(await task4.getDecrypt(0, 'abc')).toEqualCell(
            beginCell().storeUint(0, 32).storeStringTail('abc').endCell()
        );
    })
    it('should work', async () => {
        expect(await task4.getEncrypt(2, 'Hello World 1')).toEqualCell(
            beginCell().storeUint(0, 32).storeStringTail('Jgnnq Yqtnf 1').endCell()
        );
        expect(await task4.getDecrypt(2, 'Jgnnq Yqtnf 1')).toEqualCell(
            beginCell().storeUint(0, 32).storeStringTail('Hello World 1').endCell()
        );
    })
});