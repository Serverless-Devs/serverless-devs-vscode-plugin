export function setArgs(args: string[]) {
  process.env["serverless_devs_temp_argv"] = JSON.stringify(
    process.argv.slice(2).concat(args)
  );
}
