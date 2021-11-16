export class User {
    constructor(
        public id: string,
        public email: string,
        public name: string,
        public surname: string,
        public sector: string,
        public active: boolean,
        public date_of_birth: string,
        public admission_date: string,
        public gender: string,
        public cpf: string,
        public job_title: string,
        public role: string,
        private _token: string){}

    get token() {
        return this._token
    }
}

