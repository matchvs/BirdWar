/**
 * Created by john on 18/10/16.
 * 对象池模块
 */

kf.addModule("basic.pool", function() {
    var pool = {
        _name1: "Pool",
        _name2: "Prefab",
        init: function() {
        },

        getPool: function(name) {
            return this[name + this._name1];
        },

        isPool: function(name) {
            return this[name + this._name1] && this[name + this._name2];
        },

        // prefab, 任意类型的对象或者预制体
        // size，初始对象池的大小，推荐使用默认大小1
        createPrefabPool: function(prefab, count) {
            if (!this.isPool(prefab.name)) {
                this[prefab.name + this._name1] = new cc.NodePool();
                this[prefab.name + this._name2] = prefab;
            }

            var prefabPool = this[prefab.name + this._name1];
            count = count || 1;
            count -= prefabPool.size();
            for (var k = 0; k < count; k++) {
                this[prefab.name + this._name1].put(cc.instantiate(prefab));
            }
        },

        // 从对象池中获取对象
        getPrefab: function(name) {
            var prefab = null;
            if (this.isPool(name)) {
                var prefabPool = this[name + this._name1];
                if (prefabPool.size() > 0) {
                    prefab = prefabPool.get();
                } else {
                    prefab = cc.instantiate(this[name + this._name2]);
                }
            }
            return prefab;
        },

        // 从对象池中获取对象,同时初始化
        getPrefabEx: function(name, data) {
            var prefab = this.getPrefab(name);
            if (prefab) prefab.getComponent(name).setData(data);

            return prefab;
        },

        putInPool: function(name, node) {
            if (!this.isPool(name)) return;
            this[name + this._name1].put(node);
        },

        // 回收子节点中属于对象池的对象
        putChildInPool: function(node) {
            if (!cc.isValid(node) || node.children.length === 0) return;

            var count = node.children.length;
            for (var i = 0; i < count; i++) {
                var child = node.children[0];
                if (!this.isPool(child.name)) continue;
                this.putChildInPool(child);
                this.putInPool(child.name, child);
            }
        }
    };

    return pool;
});
