import * as fs from 'fs';
import * as core from "@serverless-devs/core";
const { lodash:_, jsyaml: yaml} = core;
import * as path from "path";

export const getCredentialWithAll = async () => {
    const data = await core.getCredentialAliasList();
    if (data.length > 0) {
        const res = {};
        for (const access of data) {
            const info = await core.getCredential(access);
            res[info.Alias] = _.omit(info, 'Alias');
        }
        return res;
    }
};

export const deleteCredentialByAccess = async (access: string) => {
    const filePath = path.join(core.getRootHome(), 'access.yaml');
    const accessFileInfo = await core.getYamlContent(filePath);
    if (accessFileInfo) {
        if (accessFileInfo[access]) {
            delete accessFileInfo[access];
            fs.writeFileSync(filePath, yaml.dump(accessFileInfo));
        } else {
            throw new Error(`Access not found,May have been deleted.`);
        }
    } else {
        throw new Error(`Configuration file not found.`);
    }
};

