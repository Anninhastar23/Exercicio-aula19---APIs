import express, {Request, Responde} from "express"
import Produto = require("./classes/Produto")

const app = express()
const PORT= process.env.PORT ?? 3000
app.use(express.json())

const produtos: Produto[] = []

function novoProduto(req: Request, res:Response): void{
    try{
        let data:any = req body;

        if(
            !data.nome ||
            !data.preco ||
            !data.fabricante
        ){
            res.status(400).jdon({
                message: "Produto requer nome, preço e fabricante"
            });
            return;
        }
        const produto = new Produto.Produto(
            data.id,
            data.nome,
            data.preco,
            data.fabricante
        );
    } catch (e: unknown){
        res.status(400).json({
            Message: (e as Error).message
        })
    }
}