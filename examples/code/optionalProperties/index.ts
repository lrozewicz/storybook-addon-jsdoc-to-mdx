/**
 * Interface representing a person with an optional age property.
 */
interface Person {
    name: string;
    age?: number;
}

/**
 * Function that prints a person's name and optionally age if provided.
 * @param {Person} person The person.
 */
function printPerson(person: Person): void {
    console.log(`Name: ${person.name}`);
    if (person.age !== undefined) {
        console.log(`Age: ${person.age}`);
    }
}
