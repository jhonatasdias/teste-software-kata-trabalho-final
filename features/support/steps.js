// features/step_definitions/gildedRose.steps.js

const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');

// Aqui o Node vai usar CommonJS, então o require funciona
const { Shop, Item } = require('../../src/gilded_rose.refactor');

/**
 * Helper para criar um estoque com um único item.
 * Centraliza a criação da lista de itens e da Shop.
 */
function createSingleItemInStock(world, name, sellIn, quality) {
  // Cria um item com o nome, prazo e qualidade desejados
  const item = new Item(name, sellIn, quality);
  // Cria a lista de itens do cenário (estoque atual)
  world.items = [item];
  // Cria a loja a partir da lista de itens
  world.shop = new Shop(world.items);
}

/**
 * Helper para garantir que já exista pelo menos um item no estoque
 * antes de atualizar apenas a qualidade.
 */
function ensureSingleItemExists(world) {
  if (!world.items || world.items.length === 0) {
    // Se algum cenário chamar "qualidade é X" antes de criar o item,
    // criamos um item genérico só para evitar inconsistência.
    createSingleItemInStock(world, 'Common item', 0, 0);
  }
}

/* ============================================================================
 * Givens – criação de itens no estoque (um único item)
 * ============================================================================
 */

Given(
  'existe um produto comum no estoque com prazo para venda em {int} dias',
  function (sellIn) {
    // Cria um produto comum com o prazo informado e qualidade inicial 0
    createSingleItemInStock(this, 'Common item', sellIn, 0);
  }
);

Given(
  'existe um produto comum no estoque com prazo de venda vencido em {int} dias',
  function (sellIn) {
    // Cria um produto comum já vencido (sellIn negativo)
    createSingleItemInStock(this, 'Common item', sellIn, 0);
  }
);

Given(
  'existe um Aged Brie no estoque com prazo para venda em {int} dias',
  function (sellIn) {
    // Cria um Aged Brie com o prazo informado e qualidade inicial 0
    createSingleItemInStock(this, 'Aged Brie', sellIn, 0);
  }
);

Given(
  'existe um Aged Brie no estoque com prazo de venda vencido em {int} dias',
  function (sellIn) {
    // Cria um Aged Brie já vencido, qualidade inicial 0
    createSingleItemInStock(this, 'Aged Brie', sellIn, 0);
  }
);

Given(
  'existe um ingresso Backstage no estoque para um show em {int} dias',
  function (sellIn) {
    // Cria um Backstage pass com o prazo até o show informado
    createSingleItemInStock(
      this,
      'Backstage passes to a TAFKAL80ETC concert',
      sellIn,
      0
    );
  }
);

Given(
  'existe um ingresso Backstage no estoque para um show que já passou há {int} dias',
  function (daysAgo) {
    // daysAgo é a quantidade de dias após o show (positivo),
    // mas o prazo (sellIn) no sistema é negativo
    const sellIn = -Math.abs(daysAgo);
    createSingleItemInStock(
      this,
      'Backstage passes to a TAFKAL80ETC concert',
      sellIn,
      0
    );
  }
);

Given(
  'existe um item lendário "Sulfuras" no estoque com prazo para venda em {int} dias',
  function (sellIn) {
    // Cria um Sulfuras com o prazo informado
    createSingleItemInStock(this, 'Sulfuras, Hand of Ragnaros', sellIn, 0);
  }
);

Given(
  'existe um item lendário "Sulfuras" no estoque com prazo de venda vencido em {int} dias',
  function (sellIn) {
    // Cria um Sulfuras já vencido (sellIn negativo)
    createSingleItemInStock(this, 'Sulfuras, Hand of Ragnaros', sellIn, 0);
  }
);

Given(
  'existe um item "Conjurado" no estoque com prazo para venda em {int} dias',
  function (sellIn) {
    // Cria um item Conjurado, que hoje é tratado como item comum
    createSingleItemInStock(this, 'Conjured Mana Cake', sellIn, 0);
  }
);

/* ============================================================================
 * Givens – definição de qualidade inicial (produto/ingresso/item)
 * ============================================================================
 */

Given(
  'a qualidade do {word} é {int}',
  function (_tipoPalavra, quality) {
    // Garante que exista um item antes de ajustar a qualidade
    ensureSingleItemExists(this);
    // Ajusta a qualidade do primeiro item do estoque
    this.items[0].quality = quality;
  }
);

/* ============================================================================
 * Givens – estoque com múltiplos itens (DataTable)
 * ============================================================================
 */

Given('o estoque contém:', function (dataTable) {
  // Cria uma lista de itens a partir da tabela de dados
  const rows = dataTable.hashes();

  this.items = rows.map((row) => {
    // Cada linha define tipo, nome, prazo (sellIn) e qualidade
    const name = row.nome;
    const sellIn = parseInt(row['prazo (dias)'], 10);
    const quality = parseInt(row.qualidade, 10);

    return new Item(name, sellIn, quality);
  });

  // Cria a loja (Shop) com a lista de itens definida na tabela
  this.shop = new Shop(this.items);
});

/* ============================================================================
 * When – ação de atualizar o estoque (updateQuality)
 * ============================================================================
 */

When('o sistema atualiza o estoque ao final do dia', function () {
  // Executa a lógica de atualização diária da loja
  // updateQuality atualiza this.shop.items e retorna a nova lista
  this.updatedItems = this.shop.updateQuality();
});

/* ============================================================================
 * Thens – verificação de prazo (sellIn) para venda ou para o show
 * ============================================================================
 */

Then(
  /^o prazo para venda deve passar a ser (-?\d+) dias$/,
  function (expectedSellIn) {
    // Verifica o novo prazo (sellIn) do primeiro item no estoque
    const item = this.items[0];
    const expected = parseInt(expectedSellIn, 10);
    assert.strictEqual(
      item.sellIn,
      expected,
      'O prazo para venda após a atualização não corresponde ao esperado'
    );
  }
);

Then(
  /^o prazo para venda deve continuar sendo (-?\d+) dias$/,
  function (expectedSellIn) {
    // Garante que o prazo de venda não tenha sido alterado
    const item = this.items[0];
    const expected = parseInt(expectedSellIn, 10);
    assert.strictEqual(
      item.sellIn,
      expected,
      'O prazo para venda deveria permanecer inalterado'
    );
  }
);

Then(
  /^o prazo para o show deve passar a ser (-?\d+) dias$/,
  function (expectedSellIn) {
    // Verifica o novo prazo até o show (sellIn) do primeiro item
    const item = this.items[0];
    const expected = parseInt(expectedSellIn, 10);
    assert.strictEqual(
      item.sellIn,
      expected,
      'O prazo para o show após a atualização não corresponde ao esperado'
    );
  }
);

Then(
  /^o prazo para o show deve continuar sendo (-?\d+) dias$/,
  function (expectedSellIn) {
    // Verifica que o prazo para o show permaneceu o mesmo
    const item = this.items[0];
    const expected = parseInt(expectedSellIn, 10);
    assert.strictEqual(
      item.sellIn,
      expected,
      'O prazo para o show deveria permanecer inalterado'
    );
  }
);

/* ============================================================================
 * Thens – verificação de qualidade (produto/ingresso/item)
 * ============================================================================
 */

Then(
  /^a qualidade do (produto|ingresso|item) deve passar a ser (\d+)$/,
  function (_tipo, expectedQuality) {
    // Verifica a nova qualidade após a atualização
    const item = this.items[0];
    const expected = parseInt(expectedQuality, 10);
    assert.strictEqual(
      item.quality,
      expected,
      'A qualidade após a atualização não corresponde ao valor esperado'
    );
  }
);

Then(
  /^a qualidade do (produto|ingresso|item) deve continuar sendo (\d+)$/,
  function (_tipo, expectedQuality) {
    // Verifica que a qualidade permaneceu a mesma
    const item = this.items[0];
    const expected = parseInt(expectedQuality, 10);
    assert.strictEqual(
      item.quality,
      expected,
      'A qualidade deveria permanecer inalterada após a atualização'
    );
  }
);

Then(
  /^a qualidade do (produto|ingresso|item) deve ser (\d+)$/,
  function (_tipo, expectedQuality) {
    // Verificação direta, usada em cenários como "deve ser 0"
    const item = this.items[0];
    const expected = parseInt(expectedQuality, 10);
    assert.strictEqual(
      item.quality,
      expected,
      'A qualidade do item não corresponde ao valor esperado'
    );
  }
);

/* ============================================================================
 * Thens – verificação do estoque completo (múltiplos itens, DataTable)
 * ============================================================================
 */

Then('o estoque deve ficar com:', function (dataTable) {
  // Compara cada item do estoque com a tabela esperada
  const expectedRows = dataTable.hashes();

  // Garante que a quantidade de itens esperados é igual à quantidade de itens reais
  assert.strictEqual(
    this.items.length,
    expectedRows.length,
    'A quantidade de itens no estoque após a atualização não corresponde à esperada'
  );

  expectedRows.forEach((expectedRow, index) => {
    const actualItem = this.items[index];

    const expectedName = expectedRow.nome;
    const expectedSellIn = parseInt(expectedRow['novo prazo (dias)'], 10);
    const expectedQuality = parseInt(expectedRow['nova qualidade'], 10);

    // Verifica o nome do item
    assert.strictEqual(
      actualItem.name,
      expectedName,
      `O nome do item na posição ${index} não corresponde ao esperado`
    );

    // Verifica o prazo (sellIn) do item
    assert.strictEqual(
      actualItem.sellIn,
      expectedSellIn,
      `O prazo (sellIn) do item "${expectedName}" não corresponde ao esperado`
    );

    // Verifica a qualidade do item
    assert.strictEqual(
      actualItem.quality,
      expectedQuality,
      `A qualidade do item "${expectedName}" não corresponde ao esperado`
    );
  });
});
