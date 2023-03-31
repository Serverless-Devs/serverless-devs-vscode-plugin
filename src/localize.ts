import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { extensions, env } from 'vscode';

export class Localize {
  private bundle = this.resolveLanguagePack();

  public localize(key: string, ...args: string[]): string {
    const message = this.bundle[key] || key;
    return this.format(message, args);
  }

  private format(message: string, args: string[] = []): string {
    return args.length
      ? message.replace(/\{(\d+)\}/g, (match, rest: any[]) => args[rest[0]] || match)
      : message;
  }

  private resolveLanguagePack(): Record<string, string> {
    const languageFormat = 'package.nls{0}.json';
    const defaultLanguage = languageFormat.replace('{0}', '');

    const rootPath = extensions.getExtension('serverless-devs.serverless-devs')
      ?.extensionPath as string;

    const resolvedLanguage = this.recurseCandidates(rootPath, languageFormat, env.language);

    const languageFilePath = resolve(rootPath, resolvedLanguage);

    try {
      const defaultLanguageBundle = JSON.parse(
        resolvedLanguage !== defaultLanguage
          ? readFileSync(resolve(rootPath, defaultLanguage), 'utf-8')
          : '{}',
      );

      const resolvedLanguageBundle = JSON.parse(readFileSync(languageFilePath, 'utf-8'));

      return { ...defaultLanguageBundle, ...resolvedLanguageBundle };
    } catch (err) {
      throw err;
    }
  }

  private recurseCandidates(rootPath: string, format: string, candidate: string): string {
    const filename = format.replace('{0}', `.${candidate}`);
    const filepath = resolve(rootPath, filename);
    if (existsSync(filepath)) {
      return filename;
    }
    if (candidate.split('-')[0] !== candidate) {
      return this.recurseCandidates(rootPath, format, candidate.split('-')[0]);
    }
    return format.replace('{0}', '');
  }
}

export default Localize.prototype.localize.bind(new Localize());
