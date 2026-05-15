"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Produto_1 = require("./classes/Produto");
const Fabricante_1 = require("./classes/Fabricante");
const Endereco_1 = require("./classes/Endereco");
const app = (0, express_1.default)();
const PORT = process.env.PORT ?? 3000;
app.use(express_1.default.json());
const produtos = [];
function novoProduto(req, res) {
    try {
        const data = req.body;
        if (data.id === undefined ||
            !data.name ||
            data.preco === undefined ||
            !data.fabricante) {
            throw new Error("Produto requer id, nome, preco e fabricante");
        }
        if (!data.fabricante.nome ||
            !data.fabricante.endereco ||
            !data.fabricante.endereco.cidade ||
            !data.fabricante.endereco.pais) {
            throw new Error("Fabricante requer nome, endereco.cidade e endereco.pais");
        }
        const produtoExistente = produtos.find((p) => p.id === Number(data.id));
        if (produtoExistente) {
            throw new Error("ID já cadastrado");
        }
        if (Number(data.preco) <= 0) {
            throw new Error("Preço deve ser maior que zero");
        }
        const endereco = new Endereco_1.Endereco(data.fabricante.endereco.cidade, data.fabricante.endereco.pais);
        const fabricante = new Fabricante_1.Fabricante(data.fabricante.nome, endereco);
        const produto = new Produto_1.Produto(Number(data.id), data.nome, Number(data.preco), fabricante);
        produtos.push(produto);
        res.status(201).json({
            status: "success",
            data: produto
        });
    }
    catch (e) {
        res.status(400).json({
            status: "error",
            message: e.message
        });
    }
}
function listarProdutos(req, res) {
    try {
        res.status(200).json({
            status: "success",
            data: produtos
        });
    }
    catch {
        res.status(500).json({
            status: "error",
            message: "Erro interno da aplicação"
        });
    }
}
function buscarProdutoPorId(req, res) {
    try {
        const id = Number(req.params.id);
        const produto = produtos.find((p) => p.id === id);
        if (!produto) {
            throw new Error("Produto não encontrado");
        }
        res.status(200).json({
            status: "success",
            data: produto
        });
    }
    catch (e) {
        res.status(404).json({
            status: "error",
            message: e.message
        });
    }
}
function atualizarProduto(req, res) {
    try {
        const id = Number(req.params.id);
        const produto = produtos.find((p) => p.id === id);
        if (!produto) {
            throw new Error("Produto não encontrado");
        }
        const data = req.body;
        produto.name = data.name ?? produto.name;
        produto.preco = data.preco ?? produto.preco;
        if (data.fabricante) {
            produto.fabricante.nome =
                data.fabricante.nome ?? produto.fabricante.nome;
            if (data.fabricante.endereco) {
                produto.fabricante.endereco.cidade =
                    data.fabricante.endereco.cidade ??
                        produto.fabricante.endereco.cidade;
                produto.fabricante.endereco.pais =
                    data.fabricante.endereco.pais ??
                        produto.fabricante.endereco.pais;
            }
        }
        res.status(200).json({
            status: "success",
            data: produto
        });
    }
    catch (e) {
        res.status(404).json({
            status: "error",
            message: e.message
        });
    }
}
function removerProduto(req, res) {
    try {
        const id = Number(req.params.id);
        const index = produtos.findIndex((p) => p.id === id);
        if (index === -1) {
            throw new Error("Produto não encontrado");
        }
        const produtoRemovido = produtos.splice(index, 1);
        res.status(200).json({
            status: "success",
            data: produtoRemovido[0]
        });
    }
    catch (e) {
        res.status(404).json({
            status: "error",
            message: e.message
        });
    }
}
app.post("/api/product", novoProduto);
app.get("/api/product", listarProdutos);
app.get("/api/product/:id", buscarProdutoPorId);
app.put("/api/product/:id", atualizarProduto);
app.delete("/api/product/:id", removerProduto);
app.listen(PORT, () => {
    console.log(`API em execução em: http://localhost:${PORT}`);
});
//# sourceMappingURL=app.js.map