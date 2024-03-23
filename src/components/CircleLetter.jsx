import styled from 'styled-components';

const CircleLetter = styled.span`
  display: grid;
  place-items: center;
  aspect-ratio: 1/1;
  font-size: 3rem;
  border-radius: 50%;
  background-color: var(--light);
  min-width: 3ch;
  color: var(--dark);

  font-family: 'Montserrat';
  font-weight: 700;
`;

export default CircleLetter;
