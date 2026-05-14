import {Fabricante} from "./Fabricante"

export class Produto{
    id: number
    name: string
    preco:number
    fabricante:Fabricante

    constructor(id: number, name: string, preco: number, fabricante: Fabricante){
        this.id = id
        this.name = name
        this.preco = preco
        this.fabricante = fabricante
    }
}


