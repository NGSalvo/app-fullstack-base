class User {
    private id: number;
    private name: string;
    private email: string;
    private isLogged: boolean;

    constructor(id: number, email: string, isLogged: boolean) {
        this.id = id;
        this.email = email;
        this.isLogged = isLogged;
    }

    printInfo (): void {
        console.log(`ID: ${this.id}\nEmail: ${this.email}\nisLogged:${this.isLogged}`);
    }

    getId ():number {
        return this.id;
    }

    setId (id:number) {
        this.id = id;
    }

    getEmail ():string {
        return this.email;
    }

    setEmail (email: string) {
        this.email = email;
    }

    getIsLogged ():boolean {
        return this.isLogged;
    }

    setIsLogged (isLogged: boolean) {
        this.isLogged = isLogged;
    }
}