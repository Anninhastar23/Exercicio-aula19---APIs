import {Endereco} from "./Endereco" 

export class Fabricante{
    name: string
    endereco: Endereco

    constructor(name: string, endereco: Endereco){
        this.name = name
        this.endereco = endereco
    }
}  