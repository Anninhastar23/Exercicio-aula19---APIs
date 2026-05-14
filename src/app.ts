import express, {Request, Response} from "express"
import {Produto} from "./Produto"
import {Fabricante} from "./Fabricante"
import {Endereco} from "./Endereco"

const app = express()
const PORT = process.env.PORT ?? 3000
app.use(express.json())

const produtos: Produto[] = []

function novoProduto(req: Request, res:Response): void{
    try{

        let data: any = req.body

        if(
            !data.id ||
            !data.name ||
            !data.preco ||
            !data.fabricante
        ){
            throw new Error("Produto requer nome, preço e fabricante")
        }
        if(
            !data.fabricante.nome ||
            !data.fabricante.endereco ||
            !data.fabricante.endereco.cidade ||
            !data.fabricante.endereco.pais
        ){
            throw new Error("Fabricante requer nome, cidade e país")
        }
        const produtoExistente = produtos.find(
            (produto) => produto.id === data.id
        )
        if(produtoExistente){
            throw new Error("ID já cadastrado")
        }
        if (data.preco <= 0){
            throw new Error( "Preço dever ser maior que zero")
        }
        const endereco = new Endereco (
            data.fabricante.endereco.cidade,
            data.fabricante.endereco.pais
        )
        const fabricante = new Fabricante(
            data.fabricante.nome,
            endereco
        )
        const produto = new Produto(
            data.id,
            data.nome,
            data.preco,
            fabricante
        )
        produtos.push(produto)
        
        res.status(200).json({
            status: "Sucess",
            data: produto
        })
    }catch (e: unknown){
        res.status(400).json({
            status: "Error",
            message: (e as Error).message
        })
    }
          
}

function listarProdutos(req: Request, res: Response): void{
    try{
        res.status(200).json({
            status: "Sucess",
            data: produtos
        })
    }catch{
        res.status(500).json({
            status:"Error",
            message: "Erro interno de aplicação"
        })
    }
}

function buscarProdutoPorId(
    req: Request,
    res: Response,
): void {
    try{
        let id = Number(req.params.id)

        const produto = produtos.find(
            (produto) => produto.id === id
        )
        if (!produto){
            throw new Error("Produto não encontrado")
        }
        res.status(200).json({
            status: "Sucess",
            data: produto
        })
    }catch (e: unknown){
        res.status(404).json({
            status: "Error",
            message: (e as Error).message
        })
    }
}

function filtrarProdutoPorNome(
    req: Request,
    res: Response
): void {
    try {
        let nome = req.query.nome as string
        if (!nome){
            throw new Error("Necessário informar o nome do produto")
        }
        const produtosFiltrados = produtos.filter(
            (produto) =>
                produto.nome.toLowerCase().includes(nome.toLowerCase())
        )
        res.status(200).json({
            status: "Sucess",
            data: produtosFiltrados
        })
    }catch (e: unknown){
        res.status(400).json({
            status: "Error",
            message: (e as Error).message
        })
    }
}

function atualizarProduto(
    req: Request,
    res: Response
): void{

    try{
        let id = Number(req.params.id)

        const produto = produtos.find(
            (produto) => produto.id === id
        )
        if (!produto){
            throw new Error("Produto não encontrado")
        }

        let data: any = req.body

        produto.nome = data.nome || produto.nome
        produto.preco = data.preco || produto.preco

        if (data.fabricante){
            produto.fabricante.nome = 
            data.fabricante.nome || 
            produto.fabricante.nome
            if(data.fabricante.endereco){

                produto.fabricante.endereco.cidade =
                data.fabricante.endereco.cidade ||
                produto.fabricante.endereco.cidade

                produto.fabricante.endereco.pais =
                data.fabricante.endereco.pais ||
                produto.fabricante.endereco.pais
            }
    }
    res.status(200).json({
        status: "Sucess",
        data: produto
    })
} catch (e: unknown){

    res.status(404).json({
        status: "Error",
        message: (e as Error).message
    })
}
}

function removerProduto(
    req: Request,
    res: Response
): void {
    try {
        let id = Number(req.params.id)

        const index = produtos.findIndex(
            (produto) => produto.id === id
        )
        if (index === -1){
            throw new Error("Produto não encontrado")
        }
        const produtoRemovido = produtos.splice(index, 1)

        res.status(200).json({
            status: "Sucess",
            data: produtoRemovido[0]
        })
    }catch (e: unknown){
        res.status(404).json({
            status: "Error",
            message: (e as Error).message
        })
    }
}

app.get("/api/product", novoProduto)
app.get("/api/product", filtrarProdutoPorNome)
app.get("/api/product/:id", buscarProdutoPorId)
app.get("/api/product", listarProdutos)
app.put("/api/product/:id", atualizarProduto)
app.delete("/api/product/:id", removerProduto)

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})

