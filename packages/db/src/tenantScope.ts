// packages/db/src/tenantScope.ts

export type TenantScope = {
  clientId: string;
  locationIds?: string[];
  role: 'AGENCY_ADMIN' | 'CLIENT_ADMIN' | 'LOCATION_MANAGER' | 'VIEWER';
};

export function buildTenantWhere(scope: TenantScope) {
  if (scope.role === 'AGENCY_ADMIN') return {};

  if (scope.role === 'LOCATION_MANAGER' && scope.locationIds?.length) {
    return {
      client_id: scope.clientId,
      location_id: { in: scope.locationIds },
    };
  }

  return { client_id: scope.clientId };
}