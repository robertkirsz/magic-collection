import styled from 'styled-components'

const CardContainer = styled.div`
  --cardWidth: 223;
  --cardHeight: 311;
  --cardRatio: calc(var(--cardHeight) / var(--cardWidth));
  --cardsInRow: 2;
  --mainMargin: 30px;
  --width: calc((100vw - var(--mainMargin)) / var(--cardsInRow) - 5px);
  --height: calc(var(--width) * var(--cardRatio));

  @media (min-width: 544px) { --cardsInRow: 4; }
  @media (min-width: 768px) { --cardsInRow: 5; }
  @media (min-width: 992px) { --cardsInRow: 6; }
  @media (min-width: 1200px) { --cardsInRow: 7; }

  > div:first-child {
    position: relative;
    width: var(--width);
    height: var(--height);
    max-width: calc(var(--cardWidth) * 1px);
    max-height: (var(--cardHeight) * 1px);
    margin: 0 5px 1vw 0;
    border-radius: 4%;
    &.small {
      width: calc(var(--width) * 0.6);
      height: calc(var(--width) * var(--cardRatio) * 0.6);
    }
  }
`

export default CardContainer
