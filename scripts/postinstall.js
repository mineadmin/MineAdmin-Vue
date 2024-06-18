import {access, constants, copyFile} from 'fs';

access('.env', constants.F_OK, (err) => {
    if (err) {
        copyFile('.env.example', '.env', (err) => {
            if (err) throw err;
            console.log('.env.example was copied to .env');
        });
    }
});