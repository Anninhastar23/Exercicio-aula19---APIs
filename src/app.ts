
mport express, { Request, Response } from "express"
import { Produto } from "./classes/Produto"
import { Fabricante } from "./classes/Fabricante"
import { Endereco } from "./classes/Endereco"

const app = express()
const PORT = process.env.PORT ?? 3000
app.use(express.json())

const produtos: Produto[] = []

// VALIDAÇÕES
function validarDados(data: any): void {
    if (data.id === undefined) throw new Error("ID é obrigatório")
    if (!data.name) throw new Error("Nome é obrigatório")
    if (data.preco == null) throw new Error("Preço é obrigatório")
    if (Number(data.preco) <= 0) throw new Error("Preço deve ser maior que zero")

    if (!data.fabricante?.name) throw new Error("Nome do fabricante é obrigatório")
    if (!data.fabricante?.endereco?.cidade) throw new Error("Cidade é obrigatória")
    if (!data.fabricante?.endereco?.pais) throw new Error("País é obrigatório")
}

function validarProduto(data: any): void {
    validarDados(data)
    if (produtos.some(p => p.id === Number(data.id)))
        throw new Error("ID já cadastrado")
}

// CREATE
function novoProduto(req: Request, res: Response): void {
    try {
        const data = req.body
        validarProduto(data)

        const produto = new Produto(
            Number(data.id),
            data.name,
            Number(data.preco),
            new Fabricante(
                data.fabricante.name,
                new Endereco(
                    data.fabricante.endereco.cidade,
                    data.fabricante.endereco.pais
                )
            )
        )

        produtos.push(produto)
        res.status(200).json(produto)

    } catch (e: any) {
        res.status(400).json({ message: e.message })
    }
}

// READ ALL
function listarProdutos(req: Request, res: Response): void {
    res.status(200).json(produtos)
}

// READ BY ID
function buscarProdutoPorId(req: Request, res: Response): void {
    try {
        const produto = produtos.find(p => p.id === Number(req.params.id))

        if (!produto)
            return res.status(404).json({ message: "Produto não encontrado" })

        res.status(200).json(produto)

    } catch (e: any) {
        res.status(500).json({ message: e.message })
    }
}

// UPDATE
function atualizarProduto(req: Request, res: Response): void {
    try {
        const produto = produtos.find(p => p.id === Number(req.params.id))

        if (!produto)
            return res.status(404).json({ message: "Produto não encontrado" })

        const data = req.body
        validarDados(data)

        produto.name = data.name
        produto.preco = data.preco
        produto.fabricante.name = data.fabricante.name
        produto.fabricante.endereco.cidade = data.fabricante.endereco.cidade
        produto.fabricante.endereco.pais = data.fabricante.endereco.pais

        res.status(200).json(produto)

    } catch (e: any) {
        res.status(500).json({ message: e.message })
    }
}

// DELETE
function removerProduto(req: Request, res: Response): void {
    try {
        const index = produtos.findIndex(p => p.id === Number(req.params.id))

        if (index === -1)
            return res.status(404).json({ message: "Produto não encontrado" })

        const removido = produtos.splice(index, 1)[0]
        res.status(200).json(removido)

    } catch (e: any) {
        res.status(500).json({ message: e.message })
    }
}

// ROTAS
app.post("/api/product", novoProduto)
app.get("/api/product", listarProdutos)
app.get("/api/product/:id", buscarProdutoPorId)
app.put("/api/product/:id", atualizarProduto)
app.delete("/api/product/:id", removerProduto)

app.listen(PORT, () =>
    console.log(`API em execução em: http://localhost:${PORT}`))

