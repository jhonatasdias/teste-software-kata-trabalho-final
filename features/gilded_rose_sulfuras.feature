# ==========================================================
# Sulfuras
# ==========================================================
Feature: Atualização diária do item lendário Sulfuras
  Para manter a natureza especial do item lendário
  Como responsável pelo estoque de Sulfuras
  Quero que nem a qualidade nem o prazo sejam alterados

  Scenario: Sulfuras mantém prazo e qualidade antes do vencimento
    Given existe um item lendário "Sulfuras" no estoque com prazo para venda em 10 dias
      And a qualidade do item é 80
    When o sistema atualiza o estoque ao final do dia
    Then o prazo para venda deve continuar sendo 10 dias
      And a qualidade do item deve continuar sendo 80

  Scenario: Sulfuras mantém prazo e qualidade mesmo com prazo vencido
    Given existe um item lendário "Sulfuras" no estoque com prazo de venda vencido em -1 dias
      And a qualidade do item é 80
    When o sistema atualiza o estoque ao final do dia
    Then o prazo para venda deve continuar sendo -1 dias
      And a qualidade do item deve continuar sendo 80

  Scenario: Sulfuras mantém qualquer valor de qualidade configurado
    Given existe um item lendário "Sulfuras" no estoque com prazo para venda em 5 dias
      And a qualidade do item é 30
    When o sistema atualiza o estoque ao final do dia
    Then o prazo para venda deve continuar sendo 5 dias
      And a qualidade do item deve continuar sendo 30

