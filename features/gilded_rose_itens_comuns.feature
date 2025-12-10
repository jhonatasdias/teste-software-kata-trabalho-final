# ==========================================================
# Itens Comuns
# ==========================================================
Feature: Atualização diária de itens comuns no estoque
  Para manter o estoque coerente
  Como responsável pelo controle de produtos comuns
  Quero que a qualidade e o prazo sejam ajustados automaticamente todo dia

  Scenario: Item comum perde 1 ponto de qualidade antes do prazo de venda
    Given existe um produto comum no estoque com prazo para venda em 10 dias
      And a qualidade do produto é 20
    When o sistema atualiza o estoque ao final do dia
    Then o prazo para venda deve passar a ser 9 dias
      And a qualidade do produto deve passar a ser 19

  Scenario: Item comum perde 2 pontos de qualidade no dia do vencimento
    Given existe um produto comum no estoque com prazo para venda em 0 dias
      And a qualidade do produto é 20
    When o sistema atualiza o estoque ao final do dia
    Then o prazo para venda deve passar a ser -1 dias
      And a qualidade do produto deve passar a ser 18

  Scenario: Item comum perde 2 pontos de qualidade após o vencimento
    Given existe um produto comum no estoque com prazo de venda já vencido em -1 dias
      And a qualidade do produto é 10
    When o sistema atualiza o estoque ao final do dia
    Then o prazo para venda deve passar a ser -2 dias
      And a qualidade do produto deve passar a ser 8

  Scenario: Item comum nunca fica com qualidade negativa
    Given existe um produto comum no estoque com prazo para venda em 5 dias
      And a qualidade do produto é 0
    When o sistema atualiza o estoque ao final do dia
    Then a qualidade do produto deve continuar sendo 0
      And o prazo para venda deve passar a ser 4 dias

  Scenario: Item comum com pouca qualidade no vencimento não fica negativa
    Given existe um produto comum no estoque com prazo para venda em 0 dias
      And a qualidade do produto é 1
    When o sistema atualiza o estoque ao final do dia
    Then o prazo para venda deve passar a ser -1 dias
      And a qualidade do produto deve passar a ser 0
