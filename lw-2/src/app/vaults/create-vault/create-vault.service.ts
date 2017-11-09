import { Injectable } from '@angular/core';

@Injectable()
export class CreateVaultService {

    private model = { vaultName: '', whitelist: [], amountToDeposit: 0.0, amountAvailable: 10000, masterKey: '' };

    updateData(fields: any): void {
        this.model = { ...this.model, ...fields, };
    }

    getData(): any {
        return this.model;
    }

    private resetModel() {
        this.model = { vaultName: '', whitelist: [], amountToDeposit: 0.0, amountAvailable: 10000, masterKey: '' };
    }

    createVault(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.resetModel();
            resolve();
        });
    }
       
}