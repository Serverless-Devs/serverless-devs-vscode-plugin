export function setArgs(args: string[]) {
  process.env["serverless_devs_temp_argv"] = JSON.stringify(
    process.argv.slice(2).concat(args)
  );
}

export function setEnvs(key: string, value: string) {
  process.env[key] = value;
}
