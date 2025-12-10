# ==========================================================
# Estoque como um todo
# ==========================================================
Feature: Atualização diária do estoque com múltiplos tipos de item
  Para garantir consistência do estoque
  Como responsável pelo sistema de inventário
  Quero que cada tipo de produto seja atualizado corretamente no mesmo processamento diário

  Scenario: Atualizar um estoque contendo itens comuns, Aged Brie, Backstage e Sulfuras
    Given o estoque contém:
      | tipo                              | nome                                         | prazo (dias) | qualidade |
      | comum                             | Common item                                  | 10           | 20        |
      | especial que melhora com o tempo  | Aged Brie                                   | 2            | 0         |
      | ingresso de show                  | Backstage passes to a TAFKAL80ETC concert   | 15           | 20        |
      | lendário                          | Sulfuras, Hand of Ragnaros                  | 0            | 80        |
    When o sistema atualiza o estoque ao final do dia
    Then o estoque deve ficar com:
      | nome                                         | novo prazo (dias) | nova qualidade |
      | Common item                                  | 9                 | 19             |
      | Aged Brie                                   | 1                 | 1              |
      | Backstage passes to a TAFKAL80ETC concert   | 14                | 21             |
      | Sulfuras, Hand of Ragnaros                  | 0                 | 80             |
