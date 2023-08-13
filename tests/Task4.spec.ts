import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, toNano } from 'ton-core';
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

    it('if cell not full doesnt touch it length', async () => {
        const cell = beginCell()
          .storeUint(0, 3)
          .storeRef(
            beginCell()
              .storeUint(0b1, 1).endCell()
          )
          .endCell();
    
        const cellRes = beginCell()
          .storeUint(0, 3)
          .storeUint(0b1, 1).endCell();
    
        const res = await task3.getChangedLinkedList(0b101, 0b10, cell);
        expect(res).toEqualCell(cellRes);
    });
});
