// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  apiUrl: 'https://b4cui2uq95.execute-api.eu-west-1.amazonaws.com/dev/',
  storageUrl: 'https://s3.eu-west-3.amazonaws.com/proofing-mock-api/',
  proof_id: 'PK7UJZ2C5'
};
