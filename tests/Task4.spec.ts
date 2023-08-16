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

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and task3 are ready to use
    });

    it('should encrypt', async () => {
        const msg = "Big Car";
        const key = -16;

        const encrypt = caesar_cipher(msg, key)
        console.log('getCipher', encrypt)
        expect(encrypt).toEqual("Lsq Mkb")
    });

    it('should decrypt', async () => {
        const msg = "Lsq Mkb";
        const key = 16;

        const decrypt = caesar_cipher(msg, key)
        console.log('getCipher', decrypt)

        expect(decrypt).toEqual("Big Car")
    });
});

function caesar_cipher (str: string, amount: number) {
    while (amount < 0) {
        amount += 26
    }

    let output = "";

    for (let i = 0; i < str.length; i++) {
        let c = str[i];

        if (c.match(/[a-z]/i)) {
            let code = str.charCodeAt(i);
            if (code >= 65 && code <= 90) {
                c = String.fromCharCode(((code - 65 + amount) % 26) + 65);
            }
            else if (code >= 97 && code <= 122) {
                c = String.fromCharCode(((code - 97 + amount) % 26) + 97);
            }
        }

        output += c;
    }

    return output;
}