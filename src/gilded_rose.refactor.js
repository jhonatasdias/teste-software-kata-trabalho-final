class Item {
  constructor(name, sellIn, quality) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

class Shop {
  constructor(items = []) {
    this.items = items;
  }

  isAgedBrie(item) {
    return item.name === "Aged Brie";
  }

  isBackstage(item) {
    return item.name === "Backstage passes to a TAFKAL80ETC concert";
  }

  isSulfuras(item) {
    return item.name === "Sulfuras, Hand of Ragnaros";
  }

  increaseQuality(item) {
    if (item.quality < 50) {
      item.quality = item.quality + 1;
    }
  }

  decreaseQuality(item) {
    if (item.quality > 0) {
      item.quality = item.quality - 1;
    }
  }

  updateBackstageQualityBeforeSellIn(item) {
    // aumento base
    this.increaseQuality(item);
    if (item.sellIn < 11) {
      this.increaseQuality(item);
    }
    if (item.sellIn < 6) {
      this.increaseQuality(item);
    }
  }

  updateExpiredItem(item) {
    if (this.isAgedBrie(item)) {
      // Brie ganha +1 extra após o vencimento
      this.increaseQuality(item);
      return;
    }

    if (this.isBackstage(item)) {
      // Backstage perde todo o valor
      item.quality = 0;
      return;
    }

    // Common (e Conjured na implementação atual) degradam novamente
    this.decreaseQuality(item);
  }

  updateQuality() {
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];

      if (this.isSulfuras(item)) {
        // Sulfuras nunca muda
        continue;
      }

      // Pré-vencimento
      if (this.isAgedBrie(item)) {
        this.increaseQuality(item);
      } else if (this.isBackstage(item)) {
        this.updateBackstageQualityBeforeSellIn(item);
      } else {
        // item comum (inclui Conjured)
        this.decreaseQuality(item);
      }

      // Atualiza sellIn (não se aplica a Sulfuras, já filtrado)
      item.sellIn = item.sellIn - 1;

      // Pós-vencimento
      if (item.sellIn < 0) {
        this.updateExpiredItem(item);
      }
    }

    return this.items;
  }
}

module.exports = { 
  Item,
  Shop
};
