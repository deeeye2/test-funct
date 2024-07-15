const fields = {
    Deployment: [
        { name: "name", label: "Name", required: true },
        { name: "image", label: "Container Image", required: true },
        { name: "replicas", label: "Replicas", required: true },
        { name: "volume", label: "Volume", required: false },
    ],
    Service: [
        { name: "name", label: "Name", required: true },
        { name: "type", label: "Service Type", required: true },
        { name: "port", label: "Port", required: true },
    ],
    ConfigMap: [
        { name: "name", label: "Name", required: true },
        { name: "data", label: "Data", required: true },
    ],
    Secret: [
        { name: "name", label: "Name", required: true },
        { name: "data", label: "Data", required: true },
    ],
    PersistentVolume: [
        { name: "name", label: "Name", required: true },
        { name: "capacity", label: "Capacity", required: true },
        { name: "accessModes", label: "Access Modes", required: true },
        { name: "storageClass", label: "Storage Class", required: true },
    ],
    PersistentVolumeClaim: [
        { name: "name", label: "Name", required: true },
        { name: "storageClass", label: "Storage Class", required: true },
        { name: "accessModes", label: "Access Modes", required: true },
        { name: "resources", label: "Resources", required: true },
    ],
    Ingress: [
        { name: "name", label: "Name", required: true },
        { name: "host", label: "Host", required: true },
        { name: "serviceName", label: "Service Name", required: true },
        { name: "servicePort", label: "Service Port", required: true },
    ],
    Role: [
        { name: "name", label: "Name", required: true },
        { name: "rules", label: "Rules", required: true },
    ],
    RoleBinding: [
        { name: "name", label: "Name", required: true },
        { name: "roleName", label: "Role Name", required: true },
        { name: "subjects", label: "Subjects", required: true },
    ],
    ClusterRole: [
        { name: "name", label: "Name", required: true },
        { name: "rules", label: "Rules", required: true },
    ],
    ClusterRoleBinding: [
        { name: "name", label: "Name", required: true },
        { name: "roleName", label: "Role Name", required: true },
        { name: "subjects", label: "Subjects", required: true },
    ],
    NetworkPolicy: [
        { name: "name", label: "Name", required: true },
        { name: "podSelector", label: "Pod Selector", required: true },
        { name: "policyTypes", label: "Policy Types", required: true },
    ],
};

function goToDetails() {
    const manifestTypeSelect = document.getElementById("manifestType");
    const selectedOptions = Array.from(manifestTypeSelect.selectedOptions).map(option => option.value);

    if (selectedOptions.length === 0) {
        alert('Please select at least one manifest type.');
        return;
    }

    const formFieldsDiv = document.getElementById("formFields");
    formFieldsDiv.innerHTML = "";

    selectedOptions.forEach(type => {
        if (fields[type]) {
            const fieldSet = document.createElement('fieldset');
            const legend = document.createElement('legend');
            legend.textContent = type;
            fieldSet.appendChild(legend);

            fields[type].forEach(field => {
                const fieldHtml = `
                    <label for="${field.name}-${type}">${field.label}${field.required ? '*' : ''}:</label>
                    <input type="text" id="${field.name}-${type}" name="${field.name}-${type}" ${field.required ? 'required' : ''}>
                    <br>
                `;
                fieldSet.innerHTML += fieldHtml;
            });

            formFieldsDiv.appendChild(fieldSet);
        }
    });

    document.getElementById("selectionStep").classList.add("hidden");
    document.getElementById("detailsStep").classList.remove("hidden");
}

function goBack() {
    document.getElementById("selectionStep").classList.remove("hidden");
    document.getElementById("detailsStep").classList.add("hidden");
}

function showPreview() {
    const form = document.getElementById("manifestForm");
    const formData = new FormData(form);
    const previewContent = document.getElementById("previewContent");
    const manifestTypeSelect = document.getElementById("manifestType");
    const selectedOptions = Array.from(manifestTypeSelect.selectedOptions).map(option => option.value);

    const manifests = [];

    selectedOptions.forEach(type => {
        let manifest = {};

        if (type === 'Deployment') {
            manifest = {
                apiVersion: 'apps/v1',
                kind: 'Deployment',
                metadata: {
                    name: formData.get(`name-Deployment`),
                },
                spec: {
                    replicas: parseInt(formData.get(`replicas-Deployment`)),
                    selector: {
                        matchLabels: {
                            app: formData.get(`name-Deployment`)
                        }
                    },
                    template: {
                        metadata: {
                            labels: {
                                app: formData.get(`name-Deployment`)
                            }
                        },
                        spec: {
                            containers: [{
                                name: formData.get(`name-Deployment`),
                                image: formData.get(`image-Deployment`)
                            }]
                        }
                    }
                }
            };
            if (formData.get(`volume-Deployment`)) {
                manifest.spec.template.spec.volumes = [{
                    name: formData.get(`volume-Deployment`)
                }];
            }
        } else if (type === 'Service') {
            manifest = {
                apiVersion: 'v1',
                kind: 'Service',
                metadata: {
                    name: formData.get(`name-Service`)
                },
                spec: {
                    type: formData.get(`type-Service`),
                    ports: [{
                        port: parseInt(formData.get(`port-Service`))
                    }],
                    selector: {
                        app: formData.get(`name-Service`)
                    }
                }
            };
        } else if (type === 'ConfigMap') {
            manifest = {
                apiVersion: 'v1',
                kind: 'ConfigMap',
                metadata: {
                    name: formData.get(`name-ConfigMap`)
                },
                data: {
                    [formData.get(`name-ConfigMap`)]: formData.get(`data-ConfigMap`)
                }
            };
        } else if (type === 'Secret') {
            manifest = {
                apiVersion: 'v1',
                kind: 'Secret',
                metadata: {
                    name: formData.get(`name-Secret`)
                },
                data: {
                    [formData.get(`name-Secret`)]: formData.get(`data-Secret`)
                }
            };
        } else if (type === 'PersistentVolume') {
            manifest = {
                apiVersion: 'v1',
                kind: 'PersistentVolume',
                metadata: {
                    name: formData.get(`name-PersistentVolume`)
                },
                spec: {
                    capacity: {
                        storage: formData.get(`capacity-PersistentVolume`)
                    },
                    accessModes: [formData.get(`accessModes-PersistentVolume`)],
                    storageClassName: formData.get(`storageClass-PersistentVolume`)
                }
            };
        } else if (type === 'PersistentVolumeClaim') {
            manifest = {
                apiVersion: 'v1',
                kind: 'PersistentVolumeClaim',
                metadata: {
                    name: formData.get(`name-PersistentVolumeClaim`)
                },
                spec: {
                    storageClassName: formData.get(`storageClass-PersistentVolumeClaim`),
                    accessModes: [formData.get(`accessModes-PersistentVolumeClaim`)],
                    resources: {
                        requests: {
                            storage: formData.get(`resources-PersistentVolumeClaim`)
                        }
                    }
                }
            };
        } else if (type === 'Ingress') {
            manifest = {
                apiVersion: 'networking.k8s.io/v1',
                kind: 'Ingress',
                metadata: {
                    name: formData.get(`name-Ingress`)
                },
                spec: {
                    rules: [{
                        host: formData.get(`host-Ingress`),
                        http: {
                            paths: [{
                                path: '/',
                                pathType: 'Prefix',
                                backend: {
                                    service: {
                                        name: formData.get(`serviceName-Ingress`),
                                        port: {
                                            number: parseInt(formData.get(`servicePort-Ingress`))
                                        }
                                    }
                                }
                            }]
                        }
                    }]
                }
            };
        } else if (type === 'Role') {
            manifest = {
                apiVersion: 'rbac.authorization.k8s.io/v1',
                kind: 'Role',
                metadata: {
                    name: formData.get(`name-Role`)
                },
                rules: JSON.parse(formData.get(`rules-Role`))
            };
        } else if (type === 'RoleBinding') {
            manifest = {
                apiVersion: 'rbac.authorization.k8s.io/v1',
                kind: 'RoleBinding',
                metadata: {
                    name: formData.get(`name-RoleBinding`)
                },
                roleRef: {
                    apiGroup: 'rbac.authorization.k8s.io',
                    kind: 'Role',
                    name: formData.get(`roleName-RoleBinding`)
                },
                subjects: JSON.parse(formData.get(`subjects-RoleBinding`))
            };
        } else if (type === 'ClusterRole') {
            manifest = {
                apiVersion: 'rbac.authorization.k8s.io/v1',
                kind: 'ClusterRole',
                metadata: {
                    name: formData.get(`name-ClusterRole`)
                },
                rules: JSON.parse(formData.get(`rules-ClusterRole`))
            };
        } else if (type === 'ClusterRoleBinding') {
            manifest = {
                apiVersion: 'rbac.authorization.k8s.io/v1',
                kind: 'ClusterRoleBinding',
                metadata: {
                    name: formData.get(`name-ClusterRoleBinding`)
                },
                roleRef: {
                    apiGroup: 'rbac.authorization.k8s.io',
                    kind: 'ClusterRole',
                    name: formData.get(`roleName-ClusterRoleBinding`)
                },
                subjects: JSON.parse(formData.get(`subjects-ClusterRoleBinding`))
            };
        } else if (type === 'NetworkPolicy') {
            manifest = {
                apiVersion: 'networking.k8s.io/v1',
                kind: 'NetworkPolicy',
                metadata: {
                    name: formData.get(`name-NetworkPolicy`)
                },
                spec: {
                    podSelector: JSON.parse(formData.get(`podSelector-NetworkPolicy`)),
                    policyTypes: [formData.get(`policyTypes-NetworkPolicy`)]
                }
            };
        }

        manifests.push(manifest);
    });

    previewContent.textContent = manifests.map(manifest => JSON.stringify(manifest, null, 2)).join('\n---\n');
    document.getElementById("detailsStep").classList.add("hidden");
    document.getElementById("previewStep").classList.remove("hidden");
}

function generateManifest() {
    const previewContent = document.getElementById("previewContent").textContent;
    const blob = new Blob([previewContent], { type: 'application/yaml' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'manifest.yaml';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
}

function editForm() {
    document.getElementById("previewStep").classList.add("hidden");
    document.getElementById("detailsStep").classList.remove("hidden");
}

function cancelForm() {
    document.getElementById("manifestForm").reset();
    document.getElementById("formFields").innerHTML = "";
    document.getElementById("selectionStep").classList.remove("hidden");
    document.getElementById("detailsStep").classList.add("hidden");
    document.getElementById("previewStep").classList.add("hidden");
}


