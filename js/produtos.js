// Array completo de produtos
const produtos = [
    {
        id: 1,
        nome: "Whisky Johnnie Walker Blue Label",
        descricao: "Blended Scotch Whisky de luxo com sabores complexos e textura aveludada. Perfeito para ocasiões especiais.",
        preco: 1899.90,
        imagem: "assets/img/1.jpg",
        categoria: "whisky",
        destaque: true
    },
    {
        id: 2,
        nome: "Charuto Cohiba Siglo VI",
        descricao: "Um dos charutos mais cobiçados do mundo, feito à mão em Cuba com folhas de tabaco selecionadas.",
        preco: 599.90,
        imagem: "assets/img/Charuto Cohiba Siglo VI.jpg",
        categoria: "charuto",
        destaque: true
    },
    {
        id: 3,
        nome: "Vinho Château Lafite Rothschild 2015",
        descricao: "Um dos vinhos mais prestigiados de Bordeaux, safra excepcional com aromas de frutas escuras e especiarias.",
        preco: 4999.90,
        imagem: "assets/img/Vinho Château Lafite Rothschild 2015.jpg",
        categoria: "vinho",
        destaque: true
    },
    {
        id: 4,
        nome: "Conhaque Louis XIII",
        descricao: "O ápice da arte do conhaque, envelhecido por décadas em barris de carvalho, com notas de frutas cristalizadas e baunilha.",
        preco: 12999.90,
        imagem: "assets/img/Conhaque Louis XIII.jpg",
        categoria: "conhaque",
        destaque: true
    },
    {
        id: 5,
        nome: "Whisky Macallan 18 anos",
        descricao: "Single malt escocês envelhecido por 18 anos em barris de carvalho, com notas de chocolate e frutas secas.",
        preco: 2999.90,
        imagem: "assets/img/Conhaque Louis XIII.jpg",
        categoria: "whisky",
        destaque: false
    },
    {
        id: 6,
        nome: "Vinho Dom Perignon 2012",
        descricao: "Champagne vintage francês com bolhas refinadas e aromas complexos de frutas brancas e amêndoas.",
        preco: 1599.90,
        imagem: "assets/img/Conhaque Louis XIII.jpg",
        categoria: "vinho",
        destaque: false
    },
    {
        id: 7,
        nome: "Charuto Montecristo No. 2",
        descricao: "Charuto cubano clássico com formato torpedo, oferecendo sabores ricos de madeira e nozes.",
        preco: 399.90,
        imagem: "assets/img/Conhaque Louis XIII.jpg",
        categoria: "charuto",
        destaque: false
    },
    {
        id: 8,
        nome: "Whisky Jack Daniel's Single Barrel",
        descricao: "Whisky Tennessee selecionado de barris únicos, com carácter marcante e notas de caramelo.",
        preco: 499.90,
        imagem: "assets/img/Conhaque Louis XIII.jpg",
        categoria: "whisky",
        destaque: false
    }
];

// Elementos do DOM
const produtosContainer = document.getElementById('produtos-container');
const categoriaSelect = document.getElementById('categoria');
const precoSelect = document.getElementById('preco');
const ordenarSelect = document.getElementById('ordenar');
const cartCount = document.getElementById('cart-count');

// Carregar produtos
function carregarProdutos() {
    // Limpar container
    produtosContainer.innerHTML = '';
    
    // Obter valores dos filtros
    const categoria = categoriaSelect.value;
    const preco = precoSelect.value;
    const ordenar = ordenarSelect.value;
    
    // Filtrar produtos
    let produtosFiltrados = produtos.filter(produto => {
        // Filtro por categoria
        if (categoria !== 'todos' && produto.categoria !== categoria) {
            return false;
        }
        
        // Filtro por preço
        switch(preco) {
            case '0-500':
                return produto.preco <= 500;
            case '500-1000':
                return produto.preco > 500 && produto.preco <= 1000;
            case '1000-5000':
                return produto.preco > 1000 && produto.preco <= 5000;
            case '5000+':
                return produto.preco > 5000;
            default:
                return true;
        }
    });
    
    // Ordenar produtos
    switch(ordenar) {
        case 'preco-asc':
            produtosFiltrados.sort((a, b) => a.preco - b.preco);
            break;
        case 'preco-desc':
            produtosFiltrados.sort((a, b) => b.preco - a.preco);
            break;
        case 'nome-asc':
            produtosFiltrados.sort((a, b) => a.nome.localeCompare(b.nome));
            break;
        default:
            // Ordem padrão (destaque primeiro)
            produtosFiltrados.sort((a, b) => b.destaque - a.destaque);
    }
    
    // Exibir produtos
    produtosFiltrados.forEach(produto => {
        const produtoHTML = `
            <div class="produto-item">
                <div class="produto-imagem">
                    <img src="${produto.imagem}" alt="${produto.nome}" onerror="this.src='../assets/img/placeholder.jpg'">
                    ${produto.destaque ? '<span class="produto-tag">Destaque</span>' : ''}
                </div>
                <div class="produto-info">
                    <h3>${produto.nome}</h3>
                    <p class="produto-descricao">${produto.descricao}</p>
                    <div class="produto-preco">R$ ${produto.preco.toFixed(2).replace('.', ',')}</div>
                    <button class="btn-comprar" data-id="${produto.id}">Adicionar ao Carrinho</button>
                </div>
            </div>
        `;
        produtosContainer.innerHTML += produtoHTML;
    });
    
    // Adicionar eventos aos botões
    document.querySelectorAll('.btn-comprar').forEach(btn => {
        btn.addEventListener('click', adicionarAoCarrinho);
    });
}

// Adicionar produto ao carrinho
function adicionarAoCarrinho(e) {
    const id = parseInt(e.target.getAttribute('data-id'));
    const produto = produtos.find(p => p.id === id);
    
    if (produto) {
        // Obter carrinho do localStorage ou criar um novo
        let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        
        // Verificar se o produto já está no carrinho
        const itemExistente = carrinho.find(item => item.id === id);
        
        if (itemExistente) {
            itemExistente.quantidade += 1;
        } else {
            produto.quantidade = 1;
            carrinho.push(produto);
        }
        
        // Salvar no localStorage
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        
        // Atualizar contador do carrinho
        atualizarContadorCarrinho();
        
        // Feedback visual
        e.target.textContent = '✔ Adicionado';
        e.target.style.backgroundColor = '#4CAF50';
        setTimeout(() => {
            e.target.textContent = 'Adicionar ao Carrinho';
            e.target.style.backgroundColor = '';
        }, 2000);
    }
}

// Atualizar contador do carrinho
function atualizarContadorCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
    cartCount.textContent = totalItens;
}

// Menu Mobile
const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');

burger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    burger.classList.toggle('toggle');
});

// Event listeners para filtros
categoriaSelect.addEventListener('change', carregarProdutos);
precoSelect.addEventListener('change', carregarProdutos);
ordenarSelect.addEventListener('change', carregarProdutos);

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    carregarProdutos();
    atualizarContadorCarrinho();
});