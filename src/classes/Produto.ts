import {Fabricante} from "/Fabricante"

export class Produto{
    id: number
    nome: string
    preco:number
    fabricante:Fabricante

    constructor(id: number, nome: string, preco: number, fabricante: Fabricante){
        this.id = id
        this.name = nome
        this.preco = preco
        this.fabricante = fabricante
    }
}


