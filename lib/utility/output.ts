import { OutputInterface } from '@2fd/command';

export type OutputOptions = {
    verbose: boolean;
}

export class Output {

    constructor(
        public out: OutputInterface,
        public options: OutputOptions
    ) { }

    ok(ref: string, value: string) {
        this.out.log('%c ✓ %s: %c%s', 'color:green', ref, 'color:grey', value);
    }

    info(ref: string, value: string) {

        if (this.options.verbose)
            this.out.log('%c ❭ %s: %c%s', 'color:yellow', ref, 'color:grey', value);
    }

    error(err: NodeJS.ErrnoException) {

        this.out.error('%c ✗ %s', 'color:red', err.message || err);

        if (this.options.verbose)
            this.out.error('%c%s', 'color:grey', err.stack || '    NO STACK');

        this.out.error('');
        process.exit(1);
    }
}