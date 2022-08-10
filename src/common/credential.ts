import * as fs from 'fs';
import * as core from "@serverless-devs/core";
const { lodash:_, colors, jsyaml: yaml, getRootHome, getYamlContent } = core;
import * as path from "path";


export function mark(source: string): string {
    if (!source) {
        return source;
    }
    const str = `${source.slice(0, 4)}***********${source.slice(-4)}`;
    return str;
}

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
            console.log(`Access not found`);
        }
    } else {
        console.log(`Access not found`);
    }
};

