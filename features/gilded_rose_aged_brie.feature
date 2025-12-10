# ==========================================================
# Aged Brie
# ==========================================================
Feature: Atualização diária do queijo especial Aged Brie
  Para valorizar produtos que melhoram com o tempo
  Como responsável pelo estoque de Aged Brie
  Quero que a qualidade aumente conforme o prazo passa, respeitando os limites

  Scenario: Aged Brie aumenta 1 ponto de qualidade antes do vencimento
    Given existe um Aged Brie no estoque com prazo para venda em 10 dias
      And a qualidade do produto é 20
    When o sistema atualiza o estoque ao final do dia
    Then o prazo para venda deve passar a ser 9 dias
      And a qualidade do produto deve passar a ser 21

  Scenario: Aged Brie aumenta 2 pontos de qualidade após o vencimento
    Given existe um Aged Brie no estoque com prazo para venda em 0 dias
      And a qualidade do produto é 20
    When o sistema atualiza o estoque ao final do dia
    Then o prazo para venda deve passar a ser -1 dias
      And a qualidade do produto deve passar a ser 22

  Scenario: Aged Brie não ultrapassa qualidade máxima antes do vencimento
    Given existe um Aged Brie no estoque com prazo para venda em 10 dias
      And a qualidade do produto é 50
    When o sistema atualiza o estoque ao final do dia
    Then a qualidade do produto deve continuar sendo 50
      And o prazo para venda deve passar a ser 9 dias

  Scenario: Aged Brie quase no limite após o vencimento não ultrapassa 50
    Given existe um Aged Brie no estoque com prazo para venda em 0 dias
      And a qualidade do produto é 49
    When o sistema atualiza o estoque ao final do dia
    Then o prazo para venda deve passar a ser -1 dias
      And a qualidade do produto deve passar a ser 50

  Scenario: Aged Brie já vencido com qualidade 0 aumenta 2 pontos
    Given existe um Aged Brie no estoque com prazo de venda vencido em -1 dias
      And a qualidade do produto é 0
    When o sistema atualiza o estoque ao final do dia
    Then o prazo para venda deve passar a ser -2 dias
      And a qualidade do produto deve passar a ser 2

