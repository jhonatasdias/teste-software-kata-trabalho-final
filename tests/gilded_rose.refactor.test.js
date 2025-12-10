// tests/gilded_rose.refactor.test.js
const { Shop, Item } = require('../src/gilded_rose.refactor'); // ajuste o path conforme seu projeto

function createShopWithSingleItem(name, sellIn, quality) {
  const item = new Item(name, sellIn, quality);
  const shop = new Shop([item]);
  return { shop, item };
}

describe('Gilded Rose - updateQuality', () => {
  //
  // Common items
  //
  describe('Itens comuns', () => {
    it('deve diminuir quality em 1 para item comum antes do vencimento', () => {
      // Arrange
      const initialSellIn = 10; // bem antes do vencimento
      const initialQuality = 20; // valor intermediário
      const { shop, item } = createShopWithSingleItem(
        'Common item',
        initialSellIn,
        initialQuality
      );

      // Act
      shop.updateQuality();

      // Assert
      const expectedSellIn = 9; // 10 - 1
      const expectedQuality = 19; // 20 - 1
      expect(item.sellIn).toBe(expectedSellIn);
      expect(item.quality).toBe(expectedQuality);
    });

    it('deve degradar quality em 2 para item comum quando sellIn era 0 (vencimento)', () => {
      // Arrange
      const initialSellIn = 0; // borda do vencimento
      const initialQuality = 20;
      const { shop, item } = createShopWithSingleItem(
        'Common item',
        initialSellIn,
        initialQuality
      );

      // Act
      shop.updateQuality();

      // Assert
      const expectedSellIn = -1; // 0 - 1
      const expectedQuality = 18; // 20 - 2
      expect(item.sellIn).toBe(expectedSellIn);
      expect(item.quality).toBe(expectedQuality);
    });

    it('deve degradar quality em 2 para item comum com sellIn já negativo', () => {
      // Arrange
      const initialSellIn = -1; // já vencido
      const initialQuality = 10;
      const { shop, item } = createShopWithSingleItem(
        'Common item',
        initialSellIn,
        initialQuality
      );

      // Act
      shop.updateQuality();

      // Assert
      const expectedSellIn = -2; // -1 - 1
      const expectedQuality = 8; // 10 - 2
      expect(item.sellIn).toBe(expectedSellIn);
      expect(item.quality).toBe(expectedQuality);
    });

    it('não deve deixar quality negativa para item comum com quality 0', () => {
      // Arrange
      const initialSellIn = 5;
      const initialQuality = 0; // borda inferior
      const { shop, item } = createShopWithSingleItem(
        'Common item',
        initialSellIn,
        initialQuality
      );

      // Act
      shop.updateQuality();

      // Assert
      const expectedSellIn = 4; // 5 - 1
      const expectedQuality = 0; // não pode ficar negativo
      expect(item.sellIn).toBe(expectedSellIn);
      expect(item.quality).toBe(expectedQuality);
    });

    it('não deve deixar quality negativa para item comum com quality 1 e vencendo hoje', () => {
      // Arrange
      const initialSellIn = 0; // vencimento hoje
      const initialQuality = 1; // borda para degradação dobrada
      const { shop, item } = createShopWithSingleItem(
        'Common item',
        initialSellIn,
        initialQuality
      );

      // Act
      shop.updateQuality();

      // Assert
      const expectedSellIn = -1;
      const expectedQuality = 0; // 1 - 1 e segunda redução bloqueada
      expect(item.sellIn).toBe(expectedSellIn);
      expect(item.quality).toBe(expectedQuality);
    });
  });

  //
  // Aged Brie
  //
  describe('Aged Brie', () => {
    it('deve aumentar quality em 1 antes do vencimento', () => {
      // Arrange
      const initialSellIn = 10;
      const initialQuality = 20;
      const { shop, item } = createShopWithSingleItem(
        'Aged Brie',
        initialSellIn,
        initialQuality
      );

      // Act
      shop.updateQuality();

      // Assert
      const expectedSellIn = 9; // 10 - 1
      const expectedQuality = 21; // 20 + 1
      expect(item.sellIn).toBe(expectedSellIn);
      expect(item.quality).toBe(expectedQuality);
    });

    it('deve aumentar quality em 2 após o vencimento', () => {
      // Arrange
      const initialSellIn = 0; // borda: ficará negativo
      const initialQuality = 20;
      const { shop, item } = createShopWithSingleItem(
        'Aged Brie',
        initialSellIn,
        initialQuality
      );

      // Act
      shop.updateQuality();

      // Assert
      const expectedSellIn = -1;
      const expectedQuality = 22; // +1 antes, +1 após vencimento
      expect(item.sellIn).toBe(expectedSellIn);
      expect(item.quality).toBe(expectedQuality);
    });

    it('não deve ultrapassar quality 50 antes do vencimento', () => {
      // Arrange
      const initialSellIn = 10;
      const initialQuality = 50; // limite superior
      const { shop, item } = createShopWithSingleItem(
        'Aged Brie',
        initialSellIn,
        initialQuality
      );

      // Act
      shop.updateQuality();

      // Assert
      const expectedSellIn = 9;
      const expectedQuality = 50; // permanece 50
      expect(item.sellIn).toBe(expectedSellIn);
      expect(item.quality).toBe(expectedQuality);
    });

    it('deve respeitar limite 50 quase no limite após vencimento', () => {
      // Arrange
      const initialSellIn = 0; // borda para vencido
      const initialQuality = 49; // quase no limite
      const { shop, item } = createShopWithSingleItem(
        'Aged Brie',
        initialSellIn,
        initialQuality
      );

      // Act
      shop.updateQuality();

      // Assert
      const expectedSellIn = -1;
      const expectedQuality = 50; // +2 mas truncado em 50
      expect(item.sellIn).toBe(expectedSellIn);
      expect(item.quality).toBe(expectedQuality);
    });

    it('deve aumentar quality a partir de 0 já vencido', () => {
      // Arrange
      const initialSellIn = -1; // já vencido
      const initialQuality = 0; // borda inferior
      const { shop, item } = createShopWithSingleItem(
        'Aged Brie',
        initialSellIn,
        initialQuality
      );

      // Act
      shop.updateQuality();

      // Assert
      const expectedSellIn = -2;
      const expectedQuality = 2; // +2 por dia após vencimento
      expect(item.sellIn).toBe(expectedSellIn);
      expect(item.quality).toBe(expectedQuality);
    });
  });

  //
  // Backstage passes
  //
  describe('Backstage passes', () => {
    it('deve aumentar quality em 1 com mais de 10 dias restantes', () => {
      // Arrange
      const initialSellIn = 15; // faixa > 10
      const initialQuality = 20;
      const { shop, item } = createShopWithSingleItem(
        'Backstage passes to a TAFKAL80ETC concert',
        initialSellIn,
        initialQuality
      );

      // Act
      shop.updateQuality();

      // Assert
      const expectedSellIn = 14;
      const expectedQuality = 21; // +1
      expect(item.sellIn).toBe(expectedSellIn);
      expect(item.quality).toBe(expectedQuality);
    });

    it('deve aumentar quality em 1 com 11 dias restantes (sem bônus de 10 dias)', () => {
      // Arrange
      const initialSellIn = 11; // borda do bônus de 10 dias
      const initialQuality = 20;
      const { shop, item } = createShopWithSingleItem(
        'Backstage passes to a TAFKAL80ETC concert',
        initialSellIn,
        initialQuality
      );

      // Act
      shop.updateQuality();

      // Assert
      const expectedSellIn = 10;
      const expectedQuality = 21; // ainda só +1
      expect(item.sellIn).toBe(expectedSellIn);
      expect(item.quality).toBe(expectedQuality);
    });

    it('deve aumentar quality em 2 com exatamente 10 dias restantes', () => {
      // Arrange
      const initialSellIn = 10; // borda < 11
      const initialQuality = 20;
      const { shop, item } = createShopWithSingleItem(
        'Backstage passes to a TAFKAL80ETC concert',
        initialSellIn,
        initialQuality
      );

      // Act
      shop.updateQuality();

      // Assert
      const expectedSellIn = 9;
      const expectedQuality = 22; // +1 base +1 bônus
      expect(item.sellIn).toBe(expectedSellIn);
      expect(item.quality).toBe(expectedQuality);
    });

    it('deve aumentar quality em 2 com 6 dias restantes', () => {
      // Arrange
      const initialSellIn = 6;
      const initialQuality = 20;
      const { shop, item } = createShopWithSingleItem(
        'Backstage passes to a TAFKAL80ETC concert',
        initialSellIn,
        initialQuality
      );

      // Act
      shop.updateQuality();

      // Assert
      const expectedSellIn = 5;
      const expectedQuality = 22; // +2 na faixa [6, 10]
      expect(item.sellIn).toBe(expectedSellIn);
      expect(item.quality).toBe(expectedQuality);
    });

    it('deve aumentar quality em 3 com exatamente 5 dias restantes', () => {
      // Arrange
      const initialSellIn = 5; // borda < 6
      const initialQuality = 20;
      const { shop, item } = createShopWithSingleItem(
        'Backstage passes to a TAFKAL80ETC concert',
        initialSellIn,
        initialQuality
      );

      // Act
      shop.updateQuality();

      // Assert
      const expectedSellIn = 4;
      const expectedQuality = 23; // +3 (base + <11 + <6)
      expect(item.sellIn).toBe(expectedSellIn);
      expect(item.quality).toBe(expectedQuality);
    });

    it('deve aumentar quality em 3 com 1 dia restante', () => {
      // Arrange
      const initialSellIn = 1;
      const initialQuality = 20;
      const { shop, item } = createShopWithSingleItem(
        'Backstage passes to a TAFKAL80ETC concert',
        initialSellIn,
        initialQuality
      );

      // Act
      shop.updateQuality();

      // Assert
      const expectedSellIn = 0;
      const expectedQuality = 23; // +3 na faixa [1,5]
      expect(item.sellIn).toBe(expectedSellIn);
      expect(item.quality).toBe(expectedQuality);
    });

    it('deve respeitar limite 50 perto do show', () => {
      // Arrange
      const initialSellIn = 5; // faixa de +3
      const initialQuality = 49; // quase no limite
      const { shop, item } = createShopWithSingleItem(
        'Backstage passes to a TAFKAL80ETC concert',
        initialSellIn,
        initialQuality
      );

      // Act
      shop.updateQuality();

      // Assert
      const expectedSellIn = 4;
      const expectedQuality = 50; // truncado em 50
      expect(item.sellIn).toBe(expectedSellIn);
      expect(item.quality).toBe(expectedQuality);
    });

    it('deve zerar quality no dia do show', () => {
      // Arrange
      const initialSellIn = 0; // dia do show
      const initialQuality = 20;
      const { shop, item } = createShopWithSingleItem(
        'Backstage passes to a TAFKAL80ETC concert',
        initialSellIn,
        initialQuality
      );

      // Act
      shop.updateQuality();

      // Assert
      const expectedSellIn = -1;
      const expectedQuality = 0; // perde todo valor
      expect(item.sellIn).toBe(expectedSellIn);
      expect(item.quality).toBe(expectedQuality);
    });

    it('deve manter quality 0 após o show, mesmo se entrar com valor positivo', () => {
      // Arrange
      const initialSellIn = -1; // já passou do show
      const initialQuality = 20; // valor arbitrário
      const { shop, item } = createShopWithSingleItem(
        'Backstage passes to a TAFKAL80ETC concert',
        initialSellIn,
        initialQuality
      );

      // Act
      shop.updateQuality();

      // Assert
      const expectedSellIn = -2;
      const expectedQuality = 0; // continua sem valor
      expect(item.sellIn).toBe(expectedSellIn);
      expect(item.quality).toBe(expectedQuality);
    });
  });

  //
  // Sulfuras
  //
  describe('Sulfuras, Hand of Ragnaros', () => {
    it('não deve alterar sellIn nem quality antes do vencimento', () => {
      // Arrange
      const initialSellIn = 10;
      const initialQuality = 80; // valor tradicional
      const { shop, item } = createShopWithSingleItem(
        'Sulfuras, Hand of Ragnaros',
        initialSellIn,
        initialQuality
      );

      // Act
      shop.updateQuality();

      // Assert
      expect(item.sellIn).toBe(initialSellIn);
      expect(item.quality).toBe(initialQuality);
    });

    it('não deve alterar Sulfuras mesmo com sellIn negativo', () => {
      // Arrange
      const initialSellIn = -1;
      const initialQuality = 80;
      const { shop, item } = createShopWithSingleItem(
        'Sulfuras, Hand of Ragnaros',
        initialSellIn,
        initialQuality
      );

      // Act
      shop.updateQuality();

      // Assert
      expect(item.sellIn).toBe(initialSellIn);
      expect(item.quality).toBe(initialQuality);
    });

    it('deve manter qualquer quality (não força 80)', () => {
      // Arrange
      const initialSellIn = 5;
      const initialQuality = 30; // valor não padrão
      const { shop, item } = createShopWithSingleItem(
        'Sulfuras, Hand of Ragnaros',
        initialSellIn,
        initialQuality
      );

      // Act
      shop.updateQuality();

      // Assert
      expect(item.sellIn).toBe(initialSellIn);
      expect(item.quality).toBe(initialQuality);
    });
  });

  //
  // Conjured (comportamento atual = Common)
  //
  describe('Conjured (implementação atual)', () => {
    it('deve tratar Conjured como item comum na implementação atual', () => {
      // Arrange
      const initialSellIn = 5;
      const initialQuality = 10;
      const { shop, item } = createShopWithSingleItem(
        'Conjured Mana Cake',
        initialSellIn,
        initialQuality
      );

      // Act
      shop.updateQuality();

      // Assert
      const expectedSellIn = 4;
      const expectedQuality = 9; // -1 como Common
      expect(item.sellIn).toBe(expectedSellIn);
      expect(item.quality).toBe(expectedQuality);
    });
  });

  //
  // Casos do Shop (inventário vazio e múltiplos itens)
  //
  describe('Shop - cenários de inventário', () => {
    it('não deve falhar e deve manter inventário vazio quando não há itens na loja', () => {
      // Arrange
      const shop = new Shop(); // usa o valor padrão do construtor

      // Act
      const updatedItems = shop.updateQuality();

      // Assert
      const expectedLength = 0;
      expect(shop.items.length).toBe(expectedLength);
      expect(updatedItems.length).toBe(expectedLength);
    });

    it('deve atualizar corretamente um inventário com múltiplos tipos de item', () => {
      // Arrange
      const commonItem = new Item('Common item', 10, 20); // vira (9,19)
      const brieItem = new Item('Aged Brie', 2, 0); // vira (1,1)
      const backstageItem = new Item(
        'Backstage passes to a TAFKAL80ETC concert',
        15,
        20
      ); // vira (14,21)
      const sulfurasItem = new Item('Sulfuras, Hand of Ragnaros', 0, 80); // imutável

      const items = [commonItem, brieItem, backstageItem, sulfurasItem];
      const shop = new Shop(items);

      // Act
      shop.updateQuality();

      // Assert
      const expectedItems = [
        new Item('Common item', 9, 19),
        new Item('Aged Brie', 1, 1),
        new Item(
          'Backstage passes to a TAFKAL80ETC concert',
          14,
          21
        ),
        new Item('Sulfuras, Hand of Ragnaros', 0, 80),
      ];

      expect(items).toEqual(expectedItems);
    });
  });
});