import express, { Request, Response } from "express"
import { Produto } from "./classes/Produto"
import { Fabricante } from "./classes/Fabricante"
import { Endereco } from "./classes/Endereco"

const app = express()
const PORT = process.env.PORT ?? 3000

app.use(express.json())

const produtos: Produto[] = []

function novoProduto(req: Request, res: Response): void {
    try {
        const data = req.body

        if (
            data.id === undefined ||
            !data.name ||
            data.preco === undefined ||
            !data.fabricante
        ) {
            throw new Error(
                "Produto requer id, nome, preco e fabricante"
            )
        }

        if (
            !data.fabricante.name ||
            !data.fabricante.endereco ||
            !data.fabricante.endereco.cidade ||
            !data.fabricante.endereco.pais
        ) {
            throw new Error(
                "Fabricante requer name, endereco.cidade e endereco.pais"
            )
        }

        const produtoExistente = produtos.find(
            (p) => p.id === Number(data.id)
        )

        if (produtoExistente) {
            throw new Error("ID já cadastrado")
        }

        if (Number(data.preco) <= 0) {
            throw new Error("Preço deve ser maior que zero")
        }

        const endereco = new Endereco(
            data.fabricante.endereco.cidade,
            data.fabricante.endereco.pais
        )

        const fabricante = new Fabricante(
            data.fabricante.name,
            endereco
        )

        const produto = new Produto(
            Number(data.id),
            data.name,
            Number(data.preco),
            fabricante
        )

        produtos.push(produto)

        res.status(201).json({
            status: "success",
            data: produto
        })

    } catch (e: unknown) {
        res.status(400).json({
            status: "error",
            message: (e as Error).message
        })
    }
          
}

function listarProdutos(req: Request, res: Response): void {
    try {
        res.status(200).json({
            status: "success",
            data: produtos
        })
    } catch {
        res.status(500).json({
            status: "error",
            message: "Erro interno da aplicação"
        })
    }
}

function buscarProdutoPorId(req: Request, res: Response): void {
    try {
        const id = Number(req.params.id)

        const produto = produtos.find((p) => p.id === id)

        if (!produto) {
            throw new Error("Produto não encontrado")
        }

        res.status(200).json({
            status: "success",
            data: produto
        })

    } catch (e: unknown) {
        res.status(404).json({
            status: "error",
            message: (e as Error).message
        })
    }
}

function atualizarProduto(req: Request, res: Response): void {
    try {
        const id = Number(req.params.id)

        const produto = produtos.find((p) => p.id === id)

        if (!produto) {
            throw new Error("Produto não encontrado")
        }

        const data = req.body

        produto.name = data.name ?? produto.name
        produto.preco = data.preco ?? produto.preco

        if (data.fabricante) {

            produto.fabricante.name =
                data.fabricante.name ?? produto.fabricante.name

            if (data.fabricante.endereco) {

                produto.fabricante.endereco.cidade =
                    data.fabricante.endereco.cidade ??
                    produto.fabricante.endereco.cidade

                produto.fabricante.endereco.pais =
                    data.fabricante.endereco.pais ??
                    produto.fabricante.endereco.pais
            }
        }

        res.status(200).json({
            status: "success",
            data: produto
        })

    } catch (e: unknown) {
        res.status(404).json({
            status: "error",
            message: (e as Error).message
        })
    }
}

function removerProduto(req: Request, res: Response): void {
    try {
        const id = Number(req.params.id)

        const index = produtos.findIndex((p) => p.id === id)

        if (index === -1) {
            throw new Error("Produto não encontrado")
        }

        const produtoRemovido = produtos.splice(index, 1)

        res.status(200).json({
            status: "success",
            data: produtoRemovido[0]
        })

    } catch (e: unknown) {
        res.status(404).json({
            status: "error",
            message: (e as Error).message
        })
    }
}

app.post("/api/product", novoProduto)
app.get("/api/product", listarProdutos)
app.get("/api/product/:id", buscarProdutoPorId)
app.put("/api/product/:id", atualizarProduto)
app.delete("/api/product/:id", removerProduto)

app.listen(PORT, () => console.log(`API em execução em: http://localhost:${PORT}`))
