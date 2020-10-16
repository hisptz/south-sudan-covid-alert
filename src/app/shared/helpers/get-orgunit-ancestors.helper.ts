export function getOrgUnitAncestors(orgUnitData) {
  const ancestors =
    orgUnitData && orgUnitData.ancestors ? orgUnitData.ancestors : [];
  let ancestorsObj = {};
  if (ancestors && ancestors.length) {
    for (const anc of ancestors) {
      if (anc && anc.level && anc.level === 1) {
        ancestorsObj = anc.name
          ? { ...ancestorsObj, country: anc.name }
          : { ...ancestorsObj, country: '' };
      } else if (anc && anc.level && anc.level === 2) {
        ancestorsObj = anc.name
          ? { ...ancestorsObj, state: anc.name }
          : { ...ancestorsObj, state: '' };
      } else if (anc && anc.level && anc.level === 3) {
        ancestorsObj = anc.name
          ? { ...ancestorsObj, county: anc.name }
          : { ...ancestorsObj, county: '' };
      } else {
        ancestorsObj = { ...ancestorsObj };
      }
    }
    return ancestorsObj;
  }
  return null;
}
